import { Controller, Get, Query, Param, UseGuards, Req } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstablishmentOwnershipGuard } from '../establishments/guards/establishment-ownership.guard';

@Controller('establishments/:id/indicators')
@UseGuards(JwtAuthGuard, EstablishmentOwnershipGuard)
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Get()
  async calculateIndicators(
    @Param('id') establishmentId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('herdId') herdId: string | null = null,
    @Req() req: any
  ) {
    // Validate date format and convert to Date objects
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    // Parse herdId to null if not provided
    const parsedHerdId = herdId === '' ? null : herdId;

    return this.indicatorsService.calculateIndicators(
      establishmentId,
      fromDate,
      toDate,
      parsedHerdId
    );
  }
}
