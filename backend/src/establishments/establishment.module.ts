import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Establishment } from '../entities/establishment.entity';
import { EstablishmentService } from './establishment.service';
import { EstablishmentController } from './establishment.controller';
import { EstablishmentOwnershipGuard } from './guards/establishment-ownership.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment])],
  controllers: [EstablishmentController],
  providers: [EstablishmentService, EstablishmentOwnershipGuard],
  exports: [EstablishmentService, EstablishmentOwnershipGuard],
})
export class EstablishmentModule {}
