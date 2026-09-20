import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LivestockController } from './livestock.controller';
import { LivestockService } from './livestock.service';

import { Herd } from '../entities/herd.entity';
import { Animal } from '../entities/animal.entity';
import { Weighing } from '../entities/weighing.entity';
import { LivestockEvent } from '../entities/livestock-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Herd, Animal, Weighing, LivestockEvent]),
  ],
  controllers: [LivestockController],
  providers: [LivestockService],
})
export class LivestockModule {}
