import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { EstablishmentModule } from '../establishments/establishment.module';
import { IndicatorsModule } from '../indicators/indicators.module';
import { BenchmarkModule } from '../benchmark/benchmark.module';
import { AlertsModule } from '../alerts/alerts.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    EstablishmentModule,
    IndicatorsModule,
    BenchmarkModule,
    AlertsModule,
    WeatherModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
