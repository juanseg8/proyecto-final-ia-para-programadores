import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WeatherService, WeatherResult } from './weather.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EstablishmentOwnershipGuard } from '../establishments/guards/establishment-ownership.guard';

@Controller('establishments/:establishmentId/weather')
@UseGuards(JwtAuthGuard, EstablishmentOwnershipGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(
    @Param('establishmentId') establishmentId: string,
  ): Promise<WeatherResult> {
    return this.weatherService.getWeather(establishmentId);
  }
}
