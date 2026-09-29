import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { BenchmarkService } from './benchmark.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstablishmentOwnershipGuard } from '../establishments/guards/establishment-ownership.guard';

@Controller('establishments/:establishmentId/benchmark')
@UseGuards(JwtAuthGuard, EstablishmentOwnershipGuard)
export class BenchmarkController {
  constructor(private readonly benchmarkService: BenchmarkService) {}

  @Get(':indicatorName')
  async getBenchmark(
    @Param('establishmentId') establishmentId: string,
    @Param('indicatorName') indicatorName: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new Error('Fechas "from" y "to" son requeridas');
    }

    const fromDate = new Date(from);
    let toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Formato de fecha inválido');
    }

    toDate.setUTCHours(23, 59, 59, 999);

    return this.benchmarkService.calculateBenchmark(
      establishmentId,
      indicatorName,
      fromDate,
      toDate,
    );
  }
}
