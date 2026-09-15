import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Establishment } from '../entities/establishment.entity';
import { EstablishmentService } from './establishment.service';
import { EstablishmentController } from './establishment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment])],
  controllers: [EstablishmentController],
  providers: [EstablishmentService],
})
export class EstablishmentModule {}
