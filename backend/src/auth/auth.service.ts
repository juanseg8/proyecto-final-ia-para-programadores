import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { RegisterDto, LoginDto, RefreshDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { PasswordResetToken } from '../entities/password-reset-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Session) private readonly sessionRepo: Repository<Session>,
    @InjectRepository(PasswordResetToken) private readonly resetTokenRepo: Repository<PasswordResetToken>,
    private readonly jwtService: JwtService,
  ) {}

  private hashSHA256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const passwordHash = await argon2.hash(dto.password);
    
    const user = this.userRepo.create({ email, passwordHash, name: dto.name });
    try {
      await this.userRepo.save(user);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }

    return this.createSession(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.createSession(user);
  }

  private async createSession(user: User) {
    // Generar sid
    const sid = crypto.randomUUID();
    
    const accessToken = this.jwtService.sign(
      { sub: user.id, sid },
      { expiresIn: '15m' }
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, sid, jti: crypto.randomUUID() },
      { expiresIn: '30d', secret: process.env.RT_SECRET || 'rt_secret' }
    );

    const refreshTokenHash = this.hashSHA256(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const session = this.sessionRepo.create({
      id: sid,
      userId: user.id,
      refreshTokenHash,
      expiresAt,
    });
    await this.sessionRepo.save(session);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name }
    };
  }

  async refresh(dto: RefreshDto) {
    try {
      const decoded = this.jwtService.verify(dto.refreshToken, { secret: process.env.RT_SECRET || 'rt_secret' });
      const session = await this.sessionRepo.findOne({ where: { id: decoded.sid, userId: decoded.sub } });

      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Sesión inválida o expirada');
      }

      // Validar coincidencia de hash completo (Corrección de desviación)
      const incomingHash = this.hashSHA256(dto.refreshToken);
      if (session.refreshTokenHash !== incomingHash) {
        throw new UnauthorizedException('Token inválido');
      }

      // Rotación
      const accessToken = this.jwtService.sign({ sub: session.userId, sid: session.id }, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(
        { sub: session.userId, sid: session.id, jti: crypto.randomUUID() },
        { expiresIn: '30d', secret: process.env.RT_SECRET || 'rt_secret' }
      );

      session.refreshTokenHash = this.hashSHA256(newRefreshToken);
      session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await this.sessionRepo.save(session);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async logout(sid: string) {
    await this.sessionRepo.update(sid, { revokedAt: new Date() });
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) {
      await this.resetTokenRepo.update({ userId: user.id, usedAt: IsNull() }, { usedAt: new Date() });
      const plainToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = this.hashSHA256(plainToken);
      const resetToken = this.resetTokenRepo.create({
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000)
      });
      await this.resetTokenRepo.save(resetToken);
      // Aquí iría el llamado al MailService inyectado.
    }
    return { message: 'Si el correo existe, recibirás instrucciones' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashSHA256(dto.token);
    const resetToken = await this.resetTokenRepo.findOne({ where: { tokenHash } });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException('El token ha expirado o es inválido');
    }

    const user = await this.userRepo.findOne({ where: { id: resetToken.userId } });
    if (!user) throw new UnauthorizedException('Usuario no válido');

    user.passwordHash = await argon2.hash(dto.newPassword);
    await this.userRepo.save(user);

    resetToken.usedAt = new Date();
    await this.resetTokenRepo.save(resetToken);

    await this.resetTokenRepo.createQueryBuilder()
      .update()
      .set({ usedAt: new Date() })
      .where('userId = :userId AND usedAt IS NULL', { userId: user.id })
      .execute();

    return { success: true };
  }
}
