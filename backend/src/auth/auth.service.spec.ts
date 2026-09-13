import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockSessionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockResetTokenRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    })),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test_jwt'),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Session), useValue: mockSessionRepo },
        { provide: getRepositoryToken(PasswordResetToken), useValue: mockResetTokenRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('Registro', () => {
    it('debe normalizar el email en minusculas y sin espacios', async () => {
      mockUserRepo.create.mockReturnValue({ id: 'uuid-1', email: 'test@agro.com' });
      mockSessionRepo.create.mockReturnValue({ id: 'sid-1' });

      await service.register({ email: ' TEST@Agro.COM ', password: 'password123', name: 'Test' });

      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@agro.com' })
      );
    });

    it('debe hashear la contraseña con Argon2', async () => {
      const spyArgon = jest.spyOn(argon2, 'hash');
      mockUserRepo.create.mockReturnValue({ id: 'uuid-1' });
      
      await service.register({ email: 'test@test.com', password: 'password123', name: 'Test' });
      
      expect(spyArgon).toHaveBeenCalledWith('password123');
    });
  });

  describe('Login', () => {
    it('debe comparar la contraseña provista usando argon2.verify', async () => {
      const spyArgonVerify = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      mockUserRepo.findOne.mockResolvedValue({ id: 'uuid-1', email: 'test@test.com', passwordHash: 'hashed_pw' });
      mockSessionRepo.create.mockReturnValue({ id: 'sid-1' });

      await service.login({ email: 'test@test.com', password: 'plain_password' });

      expect(spyArgonVerify).toHaveBeenCalledWith('hashed_pw', 'plain_password');
    });
  });

  describe('Helpers criptográficos (forgotPassword)', () => {
    it('el reset token debe ser un string hasheado en SHA-256 de 64 caracteres hex', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 'uuid-1', email: 'test@test.com' });
      
      await service.forgotPassword({ email: 'test@test.com' });
      
      // Debe crear un token hash
      expect(mockResetTokenRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/)
        })
      );
    });
  });

  describe('Validaciones deterministas', () => {
    it('resetPassword lanza UnauthorizedException si el token ha expirado', async () => {
      const expiredDate = new Date();
      expiredDate.setMinutes(expiredDate.getMinutes() - 10);
      mockResetTokenRepo.findOne.mockResolvedValue({ id: 'rt-1', expiresAt: expiredDate, usedAt: null });

      await expect(service.resetPassword({ token: 'any', newPassword: 'new' })).rejects.toThrow(UnauthorizedException);
    });

    it('resetPassword lanza UnauthorizedException si el token ya fue usado', async () => {
      const validDate = new Date();
      validDate.setMinutes(validDate.getMinutes() + 10);
      mockResetTokenRepo.findOne.mockResolvedValue({ id: 'rt-1', expiresAt: validDate, usedAt: new Date() });

      await expect(service.resetPassword({ token: 'any', newPassword: 'new' })).rejects.toThrow(UnauthorizedException);
    });
  });
});
