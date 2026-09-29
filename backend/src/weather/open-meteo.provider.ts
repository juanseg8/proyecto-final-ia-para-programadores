import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

export interface WeatherData {
  current: {
    temperatureC: number;
    apparentTemperatureC?: number;
    precipitationMm: number;
    windSpeedKmh: number;
    weatherCode: number;
    humidityPct?: number;
  };
  daily: Array<{
    date: string;
    tempMinC: number;
    tempMaxC: number;
    precipitationProbabilityPct: number;
    weatherCode: number;
  }>;
  fetchedAt: Date;
  provider: string;
}

@Injectable()
export class OpenMeteoProvider {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = process.env.WEATHER_BASE_URL || 'https://api.open-meteo.com/v1/forecast';
    this.timeout = parseInt(process.env.WEATHER_TIMEOUT_MS || '3000', 10);
  }

  async fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code,relative_humidity_2m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
      timezone: 'auto',
      forecast_days: '7'
    });

    const url = `${this.baseUrl}?${params.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OpenMeteo Error: ${response.statusText}`);
      }

      const data = await response.json();

      const current = data.current;
      const daily = data.daily;

      const dailyData = daily.time.map((time: string, index: number) => ({
        date: time,
        tempMinC: daily.temperature_2m_min[index],
        tempMaxC: daily.temperature_2m_max[index],
        precipitationProbabilityPct: daily.precipitation_probability_max[index],
        weatherCode: daily.weather_code[index],
      }));

      return {
        current: {
          temperatureC: current.temperature_2m,
          apparentTemperatureC: current.apparent_temperature,
          precipitationMm: current.precipitation,
          windSpeedKmh: current.wind_speed_10m,
          weatherCode: current.weather_code,
          humidityPct: current.relative_humidity_2m,
        },
        daily: dailyData,
        fetchedAt: new Date(),
        provider: 'Open-Meteo',
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}
