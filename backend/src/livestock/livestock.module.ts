import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LivestockController } from './livestock.controller';
import { LivestockService } from './livestock.service';

import { Herd } from '../entities/herd.entity';
import { Animal } from '../entities/animal.entity';
import { Weighing } from '../entities/weighing.entity';
import { LivestockEvent } from '../entities/livestock-event.entity';

import { EstablishmentModule } from '../establishments/establishment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Herd, Animal, Weighing, LivestockEvent]),
    EstablishmentModule,
  ],
  controllers: [LivestockController],
  providers: [LivestockService],
  exports: [LivestockService],
})
export class LivestockModule {}
