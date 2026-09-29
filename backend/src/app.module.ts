import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EstablishmentModule } from './establishments/establishment.module';
import { LivestockModule } from './livestock/livestock.module';
import { IndicatorsModule } from './indicators/indicators.module';
import { BenchmarkModule } from './benchmark/benchmark.module';
import { AlertsModule } from './alerts/alerts.module';
import { WeatherModule } from './weather/weather.module';
import { AiAuditModule } from './ai-audit/ai-audit.module';
import { AiModule } from './ai/ai.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Establishment } from './entities/establishment.entity';
import { Herd } from './entities/herd.entity';
import { Animal } from './entities/animal.entity';
import { Weighing } from './entities/weighing.entity';
import { LivestockEvent } from './entities/livestock-event.entity';
import { IndicatorSnapshot } from './entities/indicator-snapshot.entity';
import { BenchmarkSnapshot } from './entities/benchmark-snapshot.entity';
import { AiInteraction } from './entities/ai-interaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'agro_user',
      password: process.env.DB_PASSWORD || 'agro_pass',
      database: process.env.DB_NAME || 'agro_db',
      entities: [
        User,
        Session,
        PasswordResetToken,
        Establishment,
        Herd,
        Animal,
        Weighing,
        LivestockEvent,
        IndicatorSnapshot,
        BenchmarkSnapshot,
        AiInteraction
      ],
      synchronize: false,
    }),
    AuthModule,
    EstablishmentModule,
    LivestockModule,
    IndicatorsModule,
    BenchmarkModule,
    AlertsModule,
    WeatherModule,
    AiAuditModule,
    AiModule,
    DashboardModule,
  ],
})
export class AppModule {}
