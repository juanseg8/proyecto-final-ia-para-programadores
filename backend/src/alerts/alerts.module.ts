import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { IndicatorsModule } from '../indicators/indicators.module';
import { BenchmarkModule } from '../benchmark/benchmark.module';
import { Establishment } from '../entities/establishment.entity';
import { Weighing } from '../entities/weighing.entity';
import { Animal } from '../entities/animal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Establishment, Weighing, Animal]),
    IndicatorsModule,
    BenchmarkModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
