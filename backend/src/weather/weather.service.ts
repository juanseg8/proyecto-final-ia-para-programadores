import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Establishment } from '../entities/establishment.entity';
import { OpenMeteoProvider, WeatherData } from './open-meteo.provider';

export type WeatherResult = WeatherData | { status: 'UNAVAILABLE' };

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    private readonly weatherProvider: OpenMeteoProvider,
  ) {}

  async getWeather(establishmentId: string): Promise<WeatherResult> {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
    });

    if (!establishment) {
      throw new NotFoundException('Establecimiento no encontrado');
    }

    try {
      return await this.weatherProvider.fetchWeather(
        Number(establishment.latitude),
        Number(establishment.longitude),
      );
    } catch (error) {
      return { status: 'UNAVAILABLE' };
    }
  }
}
