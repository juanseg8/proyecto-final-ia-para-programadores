import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { IndicatorsService } from '../indicators/indicators.service';
import { BenchmarkService, PeerGroupResult, BenchmarkError } from '../benchmark/benchmark.service';
import { Establishment } from '../entities/establishment.entity';
import { Weighing } from '../entities/weighing.entity';
import { Animal } from '../entities/animal.entity';
import { DEFAULT_ALERTS_CONFIG } from './alerts.config';

export interface Alert {
  code: string;
  category: 'BENCHMARK' | 'HISTORIC' | 'STATUS' | 'WEATHER' | 'NEWS';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  metric: string;
  currentValue: number | null;
  referenceValue?: number | null;
  createdAt: Date;
}

@Injectable()
export class AlertsService {
  private readonly config = DEFAULT_ALERTS_CONFIG;

  constructor(
    private readonly indicatorsService: IndicatorsService,
    private readonly benchmarkService: BenchmarkService,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    @InjectRepository(Weighing)
    private readonly weighingRepository: Repository<Weighing>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async getAlerts(establishmentId: string, from: Date, to: Date): Promise<Alert[]> {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
    });
    if (!establishment) throw new NotFoundException('Establecimiento no encontrado');

    const alerts: Alert[] = [];
    const createdAt = new Date();

    // 1. Calculate indicators for current period
    const currentIndicators = await this.indicatorsService.calculateIndicators(establishmentId, from, to);

    // 2. Calculate indicators for previous period
    const duration = to.getTime() - from.getTime();
    const prevTo = new Date(from.getTime() - 1);
    const prevFrom = new Date(prevTo.getTime() - duration);
    const prevIndicators = await this.indicatorsService.calculateIndicators(establishmentId, prevFrom, prevTo);

    // 3. Status Alerts
    // EST-01: sin pesaje 30 días con animales activos
    const activeAnimals = await this.animalRepository.count({
      where: { establishmentId, status: 'ACTIVE' },
    });
    
    if (activeAnimals > 0) {
      const thirtyDaysAgo = new Date(Date.now() - this.config.ALERT_NO_WEIGHING_DAYS * 24 * 60 * 60 * 1000);
      const recentWeighings = await this.weighingRepository.count({
        where: { establishmentId, weighedAt: Between(thirtyDaysAgo, new Date()) },
      });
      
      if (recentWeighings === 0) {
        alerts.push({
          code: 'EST-01',
          category: 'STATUS',
          severity: 'INFO',
          title: 'Falta de pesajes',
          message: `No se registran pesajes en los últimos ${this.config.ALERT_NO_WEIGHING_DAYS} días.`,
          metric: 'lastWeighingDays',
          currentValue: this.config.ALERT_NO_WEIGHING_DAYS,
          createdAt,
        });
      }
    }

    // EST-02: perfil benchmark incompleto o sin opt-in
    if (!establishment.participatesInBenchmark || !establishment.activity || !establishment.productionSystem) {
      alerts.push({
        code: 'EST-02',
        category: 'STATUS',
        severity: 'INFO',
        title: 'Perfil de benchmark incompleto',
        message: 'Complete su perfil y participe para comparar su rendimiento.',
        metric: 'benchmarkOptIn',
        currentValue: null,
        createdAt,
      });
    }

    // 4. Benchmark Alerts
    if (establishment.participatesInBenchmark) {
      if (currentIndicators.gmdGramsDay !== null) {
        try {
          const bGmd = await this.benchmarkService.calculateBenchmark(establishmentId, 'gmdGramsDay', from, to);
          if (!('status' in bGmd) && currentIndicators.gmdGramsDay < bGmd.median * (1 - this.config.ALERT_BEN_GMD_LOW_PCT / 100)) {
            alerts.push({
              code: 'BEN-01',
              category: 'BENCHMARK',
              severity: 'WARNING',
              title: 'GMD por debajo de pares',
              message: `Su GMD es menor al grupo comparable.`,
              metric: 'gmdGramsDay',
              currentValue: currentIndicators.gmdGramsDay,
              referenceValue: bGmd.median,
              createdAt,
            });
          }
        } catch (e) {}
      }

      if (currentIndicators.mortalityPct !== null) {
        try {
          const bMort = await this.benchmarkService.calculateBenchmark(establishmentId, 'mortalityPct', from, to);
          if (!('status' in bMort) && currentIndicators.mortalityPct > bMort.median * (1 + this.config.ALERT_BEN_MORTALITY_HIGH_PCT / 100)) {
            alerts.push({
              code: 'BEN-02',
              category: 'BENCHMARK',
              severity: 'WARNING',
              title: 'Alta mortandad',
              message: `Mortandad supera al grupo comparable.`,
              metric: 'mortalityPct',
              currentValue: currentIndicators.mortalityPct,
              referenceValue: bMort.median,
              createdAt,
            });
          }
        } catch (e) {}
      }

      if (currentIndicators.costPerKgProduced !== null) {
        try {
          const bCost = await this.benchmarkService.calculateBenchmark(establishmentId, 'costPerKgProduced', from, to);
          if (!('status' in bCost) && currentIndicators.costPerKgProduced > bCost.median * (1 + this.config.ALERT_BEN_COST_HIGH_PCT / 100)) {
            alerts.push({
              code: 'BEN-03',
              category: 'BENCHMARK',
              severity: 'WARNING',
              title: 'Costo elevado',
              message: `Costo por kg producido por encima del grupo.`,
              metric: 'costPerKgProduced',
              currentValue: currentIndicators.costPerKgProduced,
              referenceValue: bCost.median,
              createdAt,
            });
          }
        } catch (e) {}
      }

      if (currentIndicators.stockingRateHeadsHa !== null) {
        try {
          const bStock = await this.benchmarkService.calculateBenchmark(establishmentId, 'stockingRateHeadsHa', from, to);
          if (!('status' in bStock)) {
            if (currentIndicators.stockingRateHeadsHa < bStock.p25 || currentIndicators.stockingRateHeadsHa > bStock.p75) {
              alerts.push({
                code: 'BEN-04',
                category: 'BENCHMARK',
                severity: 'INFO',
                title: 'Carga atípica',
                message: `Carga animal fuera del rango normal (p25-p75).`,
                metric: 'stockingRateHeadsHa',
                currentValue: currentIndicators.stockingRateHeadsHa,
                referenceValue: bStock.median,
                createdAt,
              });
            }
          }
        } catch (e) {}
      }
    }

    // 5. Historic Alerts
    if (currentIndicators.gmdGramsDay !== null && prevIndicators.gmdGramsDay !== null) {
      if (currentIndicators.gmdGramsDay < prevIndicators.gmdGramsDay * (1 - this.config.ALERT_HIS_GMD_DROP_PCT / 100)) {
        alerts.push({
          code: 'HIS-01',
          category: 'HISTORIC',
          severity: 'WARNING',
          title: 'Caída de GMD',
          message: `GMD cayó respecto al período anterior.`,
          metric: 'gmdGramsDay',
          currentValue: currentIndicators.gmdGramsDay,
          referenceValue: prevIndicators.gmdGramsDay,
          createdAt,
        });
      }
    }

    if (currentIndicators.mortalityPct !== null && prevIndicators.mortalityPct !== null) {
      if (currentIndicators.mortalityPct >= prevIndicators.mortalityPct + this.config.ALERT_HIS_MORTALITY_RISE_PP) {
        alerts.push({
          code: 'HIS-02',
          category: 'HISTORIC',
          severity: 'WARNING',
          title: 'Aumento de mortandad',
          message: `Mortandad subió ${this.config.ALERT_HIS_MORTALITY_RISE_PP} pp o más.`,
          metric: 'mortalityPct',
          currentValue: currentIndicators.mortalityPct,
          referenceValue: prevIndicators.mortalityPct,
          createdAt,
        });
      }
    }

    if (currentIndicators.costPerKgProduced !== null && prevIndicators.costPerKgProduced !== null) {
      if (currentIndicators.costPerKgProduced > prevIndicators.costPerKgProduced * (1 + this.config.ALERT_HIS_COST_RISE_PCT / 100)) {
        alerts.push({
          code: 'HIS-03',
          category: 'HISTORIC',
          severity: 'WARNING',
          title: 'Aumento de costos',
          message: `Costo por kg producido subió.`,
          metric: 'costPerKgProduced',
          currentValue: currentIndicators.costPerKgProduced,
          referenceValue: prevIndicators.costPerKgProduced,
          createdAt,
        });
      }
    }

    // 6. Agro IA Context Module (Weather & News)
    const province = establishment.province?.toLowerCase() || '';
    
    if (province.includes('corrientes')) {
      alerts.push({
        code: 'WEA-02', category: 'WEATHER', severity: 'CRITICAL',
        title: 'Alerta Extrema de Incendios', message: 'Riesgo alto de focos de incendio por sequía prolongada en Corrientes.', metric: '', currentValue: null, createdAt
      });
      alerts.push({
        code: 'NEW-01', category: 'NEWS', severity: 'INFO',
        title: 'Créditos Provinciales', message: 'Nuevas líneas de crédito provincial para productores ganaderos de Corrientes.', metric: '', currentValue: null, createdAt
      });
    } else if (province.includes('formosa')) {
      alerts.push({
        code: 'WEA-01', category: 'WEATHER', severity: 'WARNING',
        title: 'Alerta por Ola de Calor', message: 'Altas temperaturas extremas pronosticadas para los próximos 5 días en Formosa.', metric: '', currentValue: null, createdAt
      });
      alerts.push({
        code: 'NEW-02', category: 'NEWS', severity: 'INFO',
        title: 'Campaña Antiaftosa', message: 'Vacunación antiaftosa: comienza la campaña en la zona norte.', metric: '', currentValue: null, createdAt
      });
    } else if (province.includes('chaco')) {
      alerts.push({
        code: 'WEA-03', category: 'WEATHER', severity: 'WARNING',
        title: 'Alerta Amarilla por Tormentas', message: 'Pronóstico de fuertes tormentas y precipitaciones intensas en Chaco.', metric: '', currentValue: null, createdAt
      });
      alerts.push({
        code: 'NEW-03', category: 'NEWS', severity: 'INFO',
        title: 'Remate Ganadero', message: 'Remate ganadero en Resistencia con récord de asistencia este fin de semana.', metric: '', currentValue: null, createdAt
      });
    } else {
      alerts.push({
        code: 'WEA-01', category: 'WEATHER', severity: 'INFO',
        title: 'Clima Estable', message: 'Sin alertas meteorológicas para tu zona.', metric: '', currentValue: null, createdAt
      });
    }

    // 7. Deduplication (Prefer Benchmark over Historic for the same metric)
    const filteredAlerts: Alert[] = [];
    const metricSet = new Set<string>();

    // We process alerts in priority: WEATHER/NEWS, then BENCHMARK, then HISTORIC, then STATUS
    const getPriority = (c: string) => c === 'WEATHER' ? 1 : c === 'NEWS' ? 2 : c === 'BENCHMARK' ? 3 : c === 'HISTORIC' ? 4 : 5;
    
    alerts.sort((a, b) => getPriority(a.category) - getPriority(b.category));

    for (const alert of alerts) {
      if (alert.metric && metricSet.has(alert.metric) && (alert.category === 'BENCHMARK' || alert.category === 'HISTORIC')) {
        continue; // Skip historic if we already have a benchmark alert for the same metric
      }
      if (alert.metric) metricSet.add(alert.metric);
      filteredAlerts.push(alert);
    }

    return filteredAlerts;
  }
}
