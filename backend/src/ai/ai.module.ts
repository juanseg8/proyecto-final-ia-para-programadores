import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiProviderService } from './ai-provider.service';
import { AiGuardrailsService } from './ai-guardrails.service';
import { AiAuditModule } from '../ai-audit/ai-audit.module';
import { EstablishmentModule } from '../establishments/establishment.module';
import { IndicatorsModule } from '../indicators/indicators.module';
import { BenchmarkModule } from '../benchmark/benchmark.module';
import { AlertsModule } from '../alerts/alerts.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    AiAuditModule,
    EstablishmentModule,
    IndicatorsModule,
    BenchmarkModule,
    AlertsModule,
    WeatherModule,
  ],
  controllers: [AiController],
  providers: [AiService, AiProviderService, AiGuardrailsService],
})
export class AiModule {}
