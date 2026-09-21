import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentModule } from '../establishments/establishment.module';
import { Establishment } from '../entities/establishment.entity';
import { Herd } from '../entities/herd.entity';
import { Animal } from '../entities/animal.entity';
import { Weighing } from '../entities/weighing.entity';
import { LivestockEvent } from '../entities/livestock-event.entity';
import { IndicatorSnapshot } from '../entities/indicator-snapshot.entity';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicators.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Establishment,
      Herd,
      Animal,
      Weighing,
      LivestockEvent,
      IndicatorSnapshot
    ]),
    EstablishmentModule
  ],
  controllers: [IndicatorsController],
  providers: [IndicatorsService],
  exports: [IndicatorsService]
})
export class IndicatorsModule {}
