import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { OpenMeteoProvider } from './open-meteo.provider';
import { Establishment } from '../entities/establishment.entity';

import { EstablishmentModule } from '../establishments/establishment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Establishment]),
    EstablishmentModule
  ],
  controllers: [WeatherController],
  providers: [WeatherService, OpenMeteoProvider],
  exports: [WeatherService],
})
export class WeatherModule {}
