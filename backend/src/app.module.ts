import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EstablishmentModule } from './establishments/establishment.module';
import { LivestockModule } from './livestock/livestock.module';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Establishment } from './entities/establishment.entity';
import { Herd } from './entities/herd.entity';
import { Animal } from './entities/animal.entity';
import { Weighing } from './entities/weighing.entity';
import { LivestockEvent } from './entities/livestock-event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'agro_user',
      password: process.env.DB_PASSWORD || 'agro_pass',
      database: process.env.DB_NAME || 'agro_db',
      entities: [User, Session, PasswordResetToken, Establishment, Herd, Animal, Weighing, LivestockEvent],
      synchronize: false,
    }),
    AuthModule,
    EstablishmentModule,
    LivestockModule,
  ],
})
export class AppModule {}
