import { Injectable, NotFoundException } from '@nestjs/common';
import { EstablishmentService } from '../establishments/establishment.service';
import { IndicatorsService } from '../indicators/indicators.service';
import { BenchmarkService } from '../benchmark/benchmark.service';
import { AlertsService } from '../alerts/alerts.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly establishmentService: EstablishmentService,
    private readonly indicatorsService: IndicatorsService,
    private readonly benchmarkService: BenchmarkService,
    private readonly alertsService: AlertsService,
    private readonly weatherService: WeatherService,
  ) {}

  async getDashboard(establishmentId: string, from: Date, to: Date) {
    const establishment = await this.establishmentService.findById(establishmentId);
    if (!establishment) throw new NotFoundException('Establecimiento no encontrado');

    const result: any = {
      establishment: {
        id: establishment.id,
        name: establishment.name,
        activity: establishment.activity,
        productionSystem: establishment.productionSystem,
        participatesInBenchmark: establishment.participatesInBenchmark,
      },
      generatedAt: new Date(),
    };

    // Tolerate partial failures by wrapping in try/catch individually
    try {
      result.indicators = await this.indicatorsService.calculateIndicators(establishmentId, from, to);
    } catch (e) {
      result.indicators = null;
      console.error('Error fetching dashboard indicators', e);
    }

    try {
      result.alerts = await this.alertsService.getAlerts(establishmentId, from, to);
    } catch (e) {
      result.alerts = null;
      console.error('Error fetching dashboard alerts', e);
    }

    try {
      result.weather = await this.weatherService.getWeather(establishmentId);
    } catch (e) {
      result.weather = { status: 'UNAVAILABLE' };
      console.error('Error fetching dashboard weather', e);
    }

    result.benchmarkSummary = {};
    if (establishment.participatesInBenchmark && establishment.activity && establishment.productionSystem) {
      const indicatorsToBenchmark = ['gmdGramsDay', 'stockingRateHeadsHa', 'mortalityPct', 'costPerKgProduced'];
      for (const ind of indicatorsToBenchmark) {
        try {
          result.benchmarkSummary[ind] = await this.benchmarkService.calculateBenchmark(establishmentId, ind, from, to);
        } catch (e) {
          result.benchmarkSummary[ind] = { status: 'DATOS_INSUFICIENTES', reason: 'error_calculating' };
        }
      }
    }

    return result;
  }
}
