import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstablishmentOwnershipGuard } from '../establishments/guards/establishment-ownership.guard';

@Controller('establishments/:establishmentId/dashboard')
@UseGuards(JwtAuthGuard, EstablishmentOwnershipGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(
    @Param('establishmentId') establishmentId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    // Default to last 12 months if not provided
    let fromDate: Date;
    let toDate: Date;

    if (!from || !to) {
      toDate = new Date();
      fromDate = new Date();
      fromDate.setFullYear(fromDate.getFullYear() - 1);
    } else {
      fromDate = new Date(from);
      toDate = new Date(to);
    }

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Formato de fecha inválido');
    }

    return this.dashboardService.getDashboard(establishmentId, fromDate, toDate);
  }
}
