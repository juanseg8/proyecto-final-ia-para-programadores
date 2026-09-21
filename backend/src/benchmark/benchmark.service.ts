import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Establishment } from '../entities/establishment.entity';
import { BenchmarkSnapshot } from '../entities/benchmark-snapshot.entity';
import { BenchmarkConfig, DEFAULT_BENCHMARK_CONFIG } from './benchmark.config';

interface PeerGroupResult {
  median: number;
  p25: number;
  p75: number;
  peerGroupSize: number;
  relativePosition: number;
  criteria: {
    activity: string;
    system: string;
    region: string;
    scaleRange: number;
    period: string;
  };
}

interface RawPeerRow {
  value: number;
  establishment_id: string;
}

interface BenchmarkError {
  status: 'DATOS_INSUFICIENTES';
  reason: 'peer_group_below_minimum' | 'establishment_not_participating' | 'missing_activity_or_system';
}

@Injectable()
export class BenchmarkService {
  private readonly config: BenchmarkConfig;

  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,

    @InjectRepository(BenchmarkSnapshot)
    private readonly snapshotRepository: Repository<BenchmarkSnapshot>,

    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {
    this.config = DEFAULT_BENCHMARK_CONFIG;
  }

  async calculateBenchmark(
    establishmentId: string,
    indicatorName: string,
    from: Date,
    to: Date,
  ): Promise<PeerGroupResult | BenchmarkError> {
    // Validate establishment ownership would be done by controller
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
    });
    if (!establishment) {
      throw new Error('Establecimiento no encontrado');
    }

    // Check if establishment participates in benchmark
    if (!establishment.participatesInBenchmark) {
      return {
        status: 'DATOS_INSUFICIENTES',
        reason: 'establishment_not_participating',
      };
    }

    // Get current activity and system
    const activity = establishment.activity;
    const system = establishment.productionSystem;

    if (!activity || !system) {
      return {
        status: 'DATOS_INSUFICIENTES',
        reason: 'missing_activity_or_system',
      };
    }

    // Build peer group with progressive relaxation
    const peerGroup = await this.buildPeerGroup(
      establishmentId,
      activity,
      system,
      establishment.province,
      establishment.superficieHa,
      from,
      to,
    );

    if (peerGroup.length < this.config.K_MIN) {
      return {
        status: 'DATOS_INSUFICIENTES',
        reason: 'peer_group_below_minimum',
      };
    }

    // Calculate statistics
    const stats = await this.calculateStatistics(peerGroup, establishmentId, indicatorName, from, to);

    // Save snapshot
    await this.saveSnapshot(establishmentId, from, to, stats);

    return stats;
  }

  private async buildPeerGroup(
    establishmentId: string,
    activity: string,
    system: string,
    province: string,
    superficieHa: number,
    from: Date,
    to: Date,
  ): Promise<string[]> {
    // Initial criteria
    let criteria = {
      activity,
      system,
      region: province,
      scaleRange: this.config.scaleRanges.initial,
      period: '12_months',
    };

    let peerGroup: string[] = [];

    // Try to build peer group with current criteria
    peerGroup = await this.findPeers(establishmentId, criteria, superficieHa);

    // Progressively relax criteria if needed
    if (peerGroup.length < this.config.K_MIN) {
      // Relax region: province -> region -> national
      if (peerGroup.length < this.config.K_MIN) {
        criteria = { ...criteria, region: this.config.regions.region };
        peerGroup = await this.findPeers(establishmentId, criteria, superficieHa);
      }

      if (peerGroup.length < this.config.K_MIN) {
        criteria = { ...criteria, region: this.config.regions.national };
        peerGroup = await this.findPeers(establishmentId, criteria, superficieHa);
      }

      // Relax scale range
      if (peerGroup.length < this.config.K_MIN) {
        criteria = { ...criteria, scaleRange: this.config.scaleRanges.relaxed };
        peerGroup = await this.findPeers(establishmentId, criteria, superficieHa);
      }

      // Relax system: exact -> group pastoreo + semi-intensivo
      if (peerGroup.length < this.config.K_MIN) {
        const relaxedSystem = system === 'pastoreo' || system === 'semi-intensivo'
          ? [system, system === 'pastoreo' ? 'semi-intensivo' : 'pastoreo'].join(',')
          : system;
        criteria = { ...criteria, system: relaxedSystem };
        peerGroup = await this.findPeers(establishmentId, criteria, superficieHa);
      }
    }

    return peerGroup;
  }

  private async findPeers(
    establishmentId: string,
    criteria: {
      activity: string;
      system: string;
      region: string;
      scaleRange: number;
      period: string;
    },
    superficieHa: number,
  ): Promise<string[]> {
    const query = `
      SELECT e.id as establishment_id
      FROM establishments e
      WHERE e.participatesInBenchmark = true
        AND e.activity = $1
        AND e.productionSystem = ANY(STRING_TO_ARRAY($2, ','))
        AND e.province = $3
        AND e.superficieHa BETWEEN $4 * (1 - $5) AND $4 * (1 + $5)
        AND e.id != $6
    `;

    const params = [
      criteria.activity,
      criteria.system,
      criteria.region,
      superficieHa,
      criteria.scaleRange,
      establishmentId,
    ];

    const result = await this.dataSource.query(query, params);

    return result.map((row: { establishment_id: string }) => row.establishment_id);
  }

  private async calculateStatistics(
    peerGroup: string[],
    establishmentId: string,
    indicatorName: string,
    from: Date,
    to: Date,
  ): Promise<PeerGroupResult> {
    // Get indicator values for peer group and establishment
    const query = `
      SELECT
        COALESCE(is.value, 0) as value,
        is.establishmentId
      FROM indicator_snapshots is
      WHERE is.establishmentId = ANY($1)
        AND is.periodFrom >= $2
        AND is.periodTo <= $3
        AND is.${indicatorName} IS NOT NULL
    `;

    const params = [peerGroup, from, to];
    const rows = await this.dataSource.query(query, params);

    // Filter out null values and exclude self if present
    const values: number[] = rows
      .filter((row: RawPeerRow) => row.value !== null && row.value !== 0)
      .filter((row: RawPeerRow) => row.establishment_id !== establishmentId)
      .map((row: RawPeerRow) => row.value);

    if (values.length < this.config.K_MIN) {
      throw new Error('Peer group too small after filtering');
    }

    // Calculate percentiles
    const sorted = [...values].sort((a: number, b: number) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const p25 = sorted[Math.floor(sorted.length * 0.25)];
    const p75 = sorted[Math.floor(sorted.length * 0.75)];

    // Calculate relative position
    const establishmentValue = rows.find((row: RawPeerRow) => row.establishment_id === establishmentId)?.value;
    const relativePosition = establishmentValue
      ? ((establishmentValue - median) / median) * 100
      : 0;

    return {
      median,
      p25,
      p75,
      peerGroupSize: values.length,
      relativePosition: Number(relativePosition.toFixed(1)),
      criteria: {
        activity: 'exact',
        system: 'exact',
        region: 'province',
        scaleRange: this.config.scaleRanges.initial,
        period: '12_months',
      },
    };
  }

  private async saveSnapshot(
    establishmentId: string,
    from: Date,
    to: Date,
    stats: PeerGroupResult,
  ): Promise<void> {
    const snapshot = this.snapshotRepository.create({
      establishmentId,
      periodFrom: from,
      periodTo: to,
      median: stats.median,
      p25: stats.p25,
      p75: stats.p75,
      peerGroupSize: stats.peerGroupSize,
      relativePosition: stats.relativePosition,
      criteria: stats.criteria,
    });

    await this.snapshotRepository.save(snapshot);
  }
}
