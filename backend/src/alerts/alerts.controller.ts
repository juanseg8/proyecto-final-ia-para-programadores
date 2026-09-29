import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstablishmentOwnershipGuard } from '../establishments/guards/establishment-ownership.guard';

@Controller('establishments/:establishmentId/alerts')
@UseGuards(JwtAuthGuard, EstablishmentOwnershipGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async getAlerts(
    @Param('establishmentId') establishmentId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new Error('Fechas "from" y "to" son requeridas');
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Formato de fecha inválido');
    }

    return this.alertsService.getAlerts(establishmentId, fromDate, toDate);
  }
}
