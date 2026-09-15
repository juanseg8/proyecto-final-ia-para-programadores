import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Establishment } from './entities/establishment.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'agro_user',
  password: process.env.DB_PASSWORD || 'agro_pass',
  database: process.env.DB_NAME || 'agro_db',
  entities: [User, Session, PasswordResetToken, Establishment],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
});
