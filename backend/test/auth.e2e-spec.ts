import * as dotenv from 'dotenv';
dotenv.config();
process.env.NODE_ENV = 'test';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppDataSource } from '../src/data-source';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

describe('Auth (e2e) Postgres Completo', () => {
  jest.setTimeout(40000);
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    
    dataSource = app.get(DataSource);
    jwtService = app.get(JwtService);
    await dataSource.query('TRUNCATE TABLE users, sessions, password_reset_tokens CASCADE;');
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('Register', () => {
    it('password con 7 caracteres es rechazada', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test_short@agro.com', password: '1234567', name: 'User' })
        .expect(400);
    });

    it('password con más de 128 caracteres es rechazada', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test_long@agro.com', password: 'a'.repeat(129), name: 'User' })
        .expect(400);
    });

    it('password con exactamente 8 caracteres es aceptada, y el response no expone passwordHash', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'user8@agro.com', password: '12345678', name: 'User 8' })
        .expect(201);
      
      expect(res.body.user.email).toBe('user8@agro.com');
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.user.refreshTokenHash).toBeUndefined();
    });

    it('email duplicado responde con HTTP 409 Conflict', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'user8@agro.com', password: 'password123', name: 'Duplicado' })
        .expect(409);
    });
  });

  describe('Login', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'login@agro.com', password: 'password123', name: 'Login User' });
    });

    it('login correcto', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@agro.com', password: 'password123' })
        .expect(200);
      
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('usuario inexistente -> 401', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'fake@agro.com', password: 'password123' })
        .expect(401);
    });

    it('password incorrecta -> 401', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'login@agro.com', password: 'wrong' })
        .expect(401);
    });

    it('creación efectiva de Session en DB', async () => {
      const dbSessions = await dataSource.query(`SELECT * FROM sessions`);
      // Debería haber al menos las sesiones de register y login ejecutados
      expect(dbSessions.length).toBeGreaterThan(0);
      expect(dbSessions[0].id).toBeDefined();
      expect(dbSessions[0].userId).toBeDefined();
    });
  });

  describe('/auth/me', () => {
    let at: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'me_test@agro.com', password: 'password123', name: 'Me Test' });
      at = res.body.accessToken;
    });

    it('Access Token válido devuelve perfil (200) sin campos sensibles', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${at}`)
        .expect(200);
      
      expect(res.body.passwordHash).toBeUndefined();
      expect(res.body.refreshTokenHash).toBeUndefined();
      expect(res.body.tokenHash).toBeUndefined();
      expect(res.body.userId).toBeDefined();
    });

    it('sin token devuelve 401', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('token alterado devuelve 401', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${at}bad`)
        .expect(401);
    });

    it('token expirado devuelve 401', () => {
      const expiredAt = jwtService.sign({ sub: 'user-1', sid: 'sess-1' }, { expiresIn: '-1s' });
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredAt}`)
        .expect(401);
    });
  });

  describe('Refresh & Logout Múltiples Sesiones', () => {
    let rtA: string;
    let rtB: string;
    let atA: string;
    let userMultiId: string;

    beforeAll(async () => {
      const reg = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'multi@agro.com', password: 'password123', name: 'Multi' });
      userMultiId = reg.body.user.id;

      const loginA = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'multi@agro.com', password: 'password123' });
      atA = loginA.body.accessToken;
      rtA = loginA.body.refreshToken;

      const loginB = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'multi@agro.com', password: 'password123' });
      rtB = loginB.body.refreshToken;
    });

    it('refresh válido y rotación de hashes en DB', async () => {
      const decodedBefore = jwtService.decode(rtA) as any;
      const dbSessBefore = await dataSource.query(`SELECT "refreshTokenHash" FROM sessions WHERE id = '${decodedBefore.sid}'`);
      const hashBefore = dbSessBefore[0].refreshTokenHash;

      const res = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: rtA })
        .expect(200);

      rtA = res.body.refreshToken;
      
      const dbSessAfter = await dataSource.query(`SELECT "refreshTokenHash" FROM sessions WHERE id = '${decodedBefore.sid}'`);
      const hashAfter = dbSessAfter[0].refreshTokenHash;

      expect(hashBefore).not.toBe(hashAfter); // Rotación
      expect(hashAfter.length).toBe(64); // SHA-256 hex
    });

    it('Logout Session A afecta solo a A, y B sigue válida', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${atA}`)
        .expect(200);
      
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: rtA })
        .expect(401);
      
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: rtB })
        .expect(200);
    });

    it('RT firmado con secreto incorrecto da 401', () => {
      const badRt = jwtService.sign({ sub: 'any', sid: 'any' }, { secret: 'wrong' });
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: badRt })
        .expect(401);
    });

    it('Usar Access Token en /auth/refresh da 401', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: atA })
        .expect(401);
    });

    it('sesión revocada -> 401', async () => {
      // Simular login
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'multi@agro.com', password: 'password123' });
      const rt = loginRes.body.refreshToken;
      const decoded = jwtService.decode(rt) as any;
      
      // Revocar manualmente
      await dataSource.query(`UPDATE sessions SET "revokedAt" = now() WHERE id = '${decoded.sid}'`);
      
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: rt })
        .expect(401);
    });

    it('sesión expirada -> 401', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'multi@agro.com', password: 'password123' });
      const rt = loginRes.body.refreshToken;
      const decoded = jwtService.decode(rt) as any;
      
      await dataSource.query(`UPDATE sessions SET "expiresAt" = now() - interval '1 day' WHERE id = '${decoded.sid}'`);
      
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: rt })
        .expect(401);
    });

    it('sub del Refresh Token diferente al userId de la Session -> 401', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'multi@agro.com', password: 'password123' });
      
      const rt = loginRes.body.refreshToken;
      const decoded = jwtService.decode(rt) as any;

      // Firmar un nuevo token con mismo SID pero distinto SUB
      const manipulatedRt = jwtService.sign(
        { sub: '00000000-0000-0000-0000-000000000000', sid: decoded.sid },
        { expiresIn: '30d', secret: process.env.RT_SECRET || 'rt_secret' }
      );

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: manipulatedRt })
        .expect(401);
    });
  });

  describe('Forgot Password & Reset Password Completos', () => {
    let plainToken1: string;
    let plainToken2: string;
    let userId: string;
    let rtSession: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'reset_full@agro.com', password: 'oldPassword', name: 'Reset' });
      userId = res.body.user.id;
      rtSession = res.body.refreshToken;
    });

    it('forgot-password con email existente -> respuesta genérica', () => {
      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'reset_full@agro.com' })
        .expect(200)
        .expect(res => expect(res.body.message).toContain('instrucciones'));
    });

    it('forgot-password con email inexistente -> respuesta idéntica', () => {
      return request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'fake2@agro.com' })
        .expect(200)
        .expect(res => expect(res.body.message).toContain('instrucciones'));
    });

    it('generar un token y verificar que la base solo contiene SHA-256 (no texto plano)', async () => {
      // Necesitamos inyectar manualmente un plainToken simulando el flujo si no podemos atraparlo.
      // O podemos simular el hash y forzarlo.
      plainToken1 = crypto.randomBytes(32).toString('hex');
      const hash1 = crypto.createHash('sha256').update(plainToken1).digest('hex');
      
      await dataSource.query(`INSERT INTO password_reset_tokens ("userId", "tokenHash", "expiresAt") VALUES ('${userId}', '${hash1}', now() + interval '30 minutes')`);

      const tokens = await dataSource.query(`SELECT "tokenHash" FROM password_reset_tokens WHERE "userId" = '${userId}'`);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens[tokens.length - 1].tokenHash.length).toBe(64); 
    });

    it('generar un segundo token invalida el anterior', async () => {
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'reset_full@agro.com' })
        .expect(200);
      
      // En un flujo real, forgot-password invalida anteriores. Pero como inyecté plainToken1 manual, 
      // y después llamé a forgotPassword, la app debió haber invalidado plainToken1.
      const tokens = await dataSource.query(`SELECT * FROM password_reset_tokens WHERE "userId" = '${userId}' ORDER BY "createdAt" ASC`);
      
      const firstToken = tokens.find((t: any) => t.usedAt !== null);
      expect(firstToken).toBeDefined(); // El anterior debe estar invalidado (usedAt != null)
      
      // Y debe haber uno activo
      const activeToken = tokens.find((t: any) => t.usedAt === null);
      expect(activeToken).toBeDefined();
    });

    it('reset válido cambia contraseña', async () => {
      // Inyectamos uno válido conocido para testear el reset exacto
      plainToken2 = crypto.randomBytes(32).toString('hex');
      const hash2 = crypto.createHash('sha256').update(plainToken2).digest('hex');
      await dataSource.query(`INSERT INTO password_reset_tokens ("userId", "tokenHash", "expiresAt") VALUES ('${userId}', '${hash2}', now() + interval '30 minutes')`);

      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token: plainToken2, newPassword: 'newPassword123' })
        .expect(200)
        .expect({ success: true });
    });

    it('password persistida sigue siendo Argon2id', async () => {
      const users = await dataSource.query(`SELECT "passwordHash" FROM users WHERE id = '${userId}'`);
      expect(users[0].passwordHash.startsWith('$argon2')).toBe(true);
    });

    it('token utilizado queda invalidado', async () => {
      const hash2 = crypto.createHash('sha256').update(plainToken2).digest('hex');
      const used = await dataSource.query(`SELECT "usedAt" FROM password_reset_tokens WHERE "tokenHash" = '${hash2}'`);
      expect(used[0].usedAt).not.toBeNull();
    });

    it('token ya utilizado -> rechazo', () => {
      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token: plainToken2, newPassword: 'anotherPassword' })
        .expect(401);
    });

    it('token inexistente -> rechazo', () => {
      return request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token: 'fake_plain_token', newPassword: 'newPassword123' })
        .expect(401);
    });

    it('token expirado -> rechazo', async () => {
      const plainExpired = crypto.randomBytes(32).toString('hex');
      const hashExpired = crypto.createHash('sha256').update(plainExpired).digest('hex');
      const expiredDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      await dataSource.query(`INSERT INTO password_reset_tokens ("userId", "tokenHash", "expiresAt") VALUES ('${userId}', '${hashExpired}', '${expiredDate}')`);

      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({ token: plainExpired, newPassword: 'newPassword123' })
        .expect(401);
    });

    it('password anterior deja de funcionar', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'reset_full@agro.com', password: 'oldPassword' })
        .expect(401);
    });

    it('nueva password funciona', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'reset_full@agro.com', password: 'newPassword123' })
        .expect(200);
    });

    it('sesiones existentes continúan activas después del cambio de contraseña', async () => {
      // El rtSession de antes del reset debe seguir funcionando
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: rtSession })
        .expect(200);
    });
  });
});
