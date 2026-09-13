import { User } from '../src/entities/user.entity';
import { Session } from '../src/entities/session.entity';

describe('Entidades Base (Tarea 1)', () => {
  describe('User Entity', () => {
    it('debería tener las propiedades esperadas', () => {
      const user = new User();
      user.id = 'uuid-123';
      user.email = 'pedro@agro.com';
      user.passwordHash = 'hash';
      user.name = 'Pedro';
      
      expect(user.id).toBeDefined();
      expect(user.email).toBe('pedro@agro.com');
      expect(user.passwordHash).toBe('hash');
      expect(user.name).toBe('Pedro');
    });
  });

  describe('Session Entity', () => {
    it('debería tener las propiedades y FKs esperadas', () => {
      const session = new Session();
      session.id = 'uuid-sid';
      session.userId = 'uuid-123';
      session.refreshTokenHash = 'sha256-hash';
      session.expiresAt = new Date();
      
      expect(session.id).toBe('uuid-sid');
      expect(session.userId).toBe('uuid-123');
      expect(session.refreshTokenHash).toBe('sha256-hash');
      expect(session.expiresAt).toBeInstanceOf(Date);
      expect(session.revokedAt).toBeUndefined(); // Por defecto sin revocar
    });
  });
});
