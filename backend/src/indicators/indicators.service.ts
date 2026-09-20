import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull, Not } from 'typeorm';
import { Establishment } from '../entities/establishment.entity';
import { Herd } from '../entities/herd.entity';
import { Animal } from '../entities/animal.entity';
import { Weighing } from '../entities/weighing.entity';
import { LivestockEvent } from '../entities/livestock-event.entity';
import { IndicatorSnapshot } from '../entities/indicator-snapshot.entity';

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,

    @InjectRepository(Herd)
    private readonly herdRepository: Repository<Herd>,

    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,

    @InjectRepository(Weighing)
    private readonly weighingRepository: Repository<Weighing>,

    @InjectRepository(LivestockEvent)
    private readonly livestockEventRepository: Repository<LivestockEvent>,

    @InjectRepository(IndicatorSnapshot)
    private readonly snapshotRepository: Repository<IndicatorSnapshot>,
  ) {}

  async calculateIndicators(
    establishmentId: string,
    from: Date,
    to: Date,
    herdId: string | null = null,
  ) {
    // Validate ownership of establishment
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
    });
    if (!establishment) {
      throw new NotFoundException('Establecimiento no encontrado');
    }

    // Validate ownership of herd if provided
    if (herdId) {
      const herd = await this.herdRepository.findOne({
        where: { id: herdId, establishmentId },
      });
      if (!herd) {
        throw new NotFoundException('Rodeo no encontrado');
      }
    }

    // Validate date range
    if (from > to) {
      throw new BadRequestException('Fecha "from" no puede ser posterior a "to"');
    }

    // Calculate GMD
    const gmdGramsDay = await this.calculateGMD(establishmentId, from, to, herdId);

    // Calculate active head count
    const activeHeadCount = await this.calculateActiveHeadCount(establishmentId, herdId);

    // Calculate stocking rate
    const stockingRateHeadsHa = await this.calculateStockingRate(establishmentId, activeHeadCount);

    // Calculate mortality percentage
    const mortalityPct = await this.calculateMortalityPct(establishmentId, from, to, herdId, activeHeadCount);

    // Calculate cost per kg produced
    const costPerKgProduced = await this.calculateCostPerKgProduced(establishmentId, from, to, herdId);

    // Create snapshot
    const snapshot = this.snapshotRepository.create({
      establishmentId,
      herdId,
      periodFrom: from,
      periodTo: to,
      gmdGramsDay,
      activeHeadCount,
      stockingRateHeadsHa,
      mortalityPct,
      costPerKgProduced,
      calculatedAt: new Date(),
    });

    return await this.snapshotRepository.save(snapshot);
  }

  private async calculateGMD(
    establishmentId: string,
    from: Date,
    to: Date,
    herdId: string | null = null,
  ): Promise<number | null> {
    // Find weighings for the period
    const where: any = {
      establishmentId,
      weighedAt: Between(from, to),
    };

    if (herdId) {
      where.herdId = herdId;
    }

    const weighings = await this.weighingRepository.find({
      where,
      order: {
        weighedAt: 'ASC',
      },
    });

    if (weighings.length < 2) {
      return null;
    }

    // Group by animal and calculate GMD for each
    const animalGMDs: number[] = [];

    for (const animalId of [...new Set(weighings.map(w => w.animalId))]) {
      const animalWeighings = weighings.filter(w => w.animalId === animalId);
      if (animalWeighings.length < 2) continue;

      const firstWeight = Number(animalWeighings[0].weightKg);
      const lastWeight = Number(animalWeighings[animalWeighings.length - 1].weightKg);
      const firstDate = animalWeighings[0].weighedAt;
      const lastDate = animalWeighings[animalWeighings.length - 1].weighedAt;

      const days = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      if (days <= 0) continue;

      const weightGainKg = lastWeight - firstWeight;
      const gmdGrams = (weightGainKg * 1000) / days;

      if (!isNaN(gmdGrams) && gmdGrams > 0) {
        animalGMDs.push(gmdGrams);
      }
    }

    if (animalGMDs.length === 0) {
      return null;
    }

    // Return average as integer (rounded)
    const avgGMD = animalGMDs.reduce((sum, val) => sum + val, 0) / animalGMDs.length;
    return Math.round(avgGMD);
  }

  private async calculateActiveHeadCount(
    establishmentId: string,
    herdId: string | null = null,
  ): Promise<number | null> {
    const where: any = {
      establishmentId,
      status: 'ACTIVE',
    };

    if (herdId) {
      where.herdId = herdId;
    }

    const count = await this.animalRepository.count({ where });
    return count > 0 ? count : null;
  }

  private async calculateStockingRate(
    establishmentId: string,
    activeHeadCount: number | null,
  ): Promise<number | null> {
    if (activeHeadCount === null || activeHeadCount === 0) {
      return null;
    }

    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
    });

    if (!establishment || establishment.superficieHa <= 0) {
      return null;
    }

    const rate = Number(activeHeadCount) / Number(establishment.superficieHa);
    return Number(rate.toFixed(2));
  }

  private async calculateMortalityPct(
    establishmentId: string,
    from: Date,
    to: Date,
    herdId: string | null = null,
    activeHeadCount: number | null,
  ): Promise<number | null> {
    // Find death events in the period
    const where: any = {
      establishmentId,
      type: 'DEATH',
      occurredAt: Between(from, to),
    };

    if (herdId) {
      where.herdId = herdId;
    }

    const deathEvents = await this.livestockEventRepository.find({
      where,
    });

    const deathCount = deathEvents.length;

    // Calculate denominator according to spec
    const denominator = activeHeadCount !== null
      ? Number(activeHeadCount) + deathCount
      : deathCount;

    if (denominator === 0) {
      return 0; // As per spec: denominator 0 => 0
    }

    const mortality = (deathCount / denominator) * 100;
    return Number(mortality.toFixed(2));
  }

  private async calculateCostPerKgProduced(
    establishmentId: string,
    from: Date,
    to: Date,
    herdId: string | null = null,
  ): Promise<number | null> {
    // Find COST events in the period
    const costWhere: any = {
      establishmentId,
      type: 'COST',
      occurredAt: Between(from, to),
    };

    if (herdId) {
      costWhere.herdId = herdId;
    }

    const costEvents = await this.livestockEventRepository.find({
      where: costWhere,
    });

    // Find FEEDING and HEALTH events in the period
    const feedingHealthWhere: any = {
      establishmentId,
      type: ['FEEDING', 'HEALTH'],
      occurredAt: Between(from, to),
    };

    if (herdId) {
      feedingHealthWhere.herdId = herdId;
    }

    const feedingHealthEvents = await this.livestockEventRepository.find({
      where: feedingHealthWhere,
    });

    // Calculate total cost
    let totalCost = 0;
    for (const event of [...costEvents, ...feedingHealthEvents]) {
      if (event.amount !== null && event.amount !== undefined) {
        totalCost += Number(event.amount);
      }
    }

    if (totalCost <= 0) {
      return null;
    }

    // Calculate total weight gain (positive only)
    let totalWeightGainKg = 0;
    const weighingsWhere: any = {
      establishmentId,
      weighedAt: Between(from, to),
    };

    if (herdId) {
      weighingsWhere.herdId = herdId;
    }

    const weighings = await this.weighingRepository.find({
      where: weighingsWhere,
      order: {
        weighedAt: 'ASC',
      },
    });

    // Group by animal to calculate weight gain
    for (const animalId of [...new Set(weighings.map(w => w.animalId))]) {
      const animalWeighings = weighings.filter(w => w.animalId === animalId);
      if (animalWeighings.length < 2) continue;

      const firstWeight = Number(animalWeighings[0].weightKg);
      const lastWeight = Number(animalWeighings[animalWeighings.length - 1].weightKg);

      const weightGainKg = lastWeight - firstWeight;
      if (weightGainKg > 0) {
        totalWeightGainKg += weightGainKg;
      }
    }

    if (totalWeightGainKg <= 0) {
      return null;
    }

    const costPerKg = totalCost / totalWeightGainKg;
    return Number(costPerKg.toFixed(2));
  }
}
