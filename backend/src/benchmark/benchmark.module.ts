import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenchmarkController } from './benchmark.controller';
import { BenchmarkService } from './benchmark.service';
import { Establishment } from '../entities/establishment.entity';
import { BenchmarkSnapshot } from '../entities/benchmark-snapshot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment, BenchmarkSnapshot])],
  controllers: [BenchmarkController],
  providers: [BenchmarkService],
  exports: [BenchmarkService],
})
export class BenchmarkModule {}
