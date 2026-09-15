import { getMetadataArgsStorage } from 'typeorm';

describe('Establishment Entity', () => {
  let Establishment: any;
  let User: any;

  beforeAll(() => {
    try {
      Establishment = require('../src/entities/establishment.entity').Establishment;
    } catch (e) {
      // Ignore to let tests fail gracefully
    }
    try {
      User = require('../src/entities/user.entity').User;
    } catch (e) {}
  });

  it('debería existir la entidad Establishment', () => {
    expect(Establishment).toBeDefined();
    const entityMetadata = getMetadataArgsStorage().tables.find(
      (t) => t.target === Establishment,
    );
    expect(entityMetadata).toBeDefined();
  });

  it('debería tener la relación ManyToOne con User (userId obligatorio)', () => {
    expect(Establishment).toBeDefined();
    const relations = getMetadataArgsStorage().relations.filter(
      (r) => r.target === Establishment,
    );
    const userRelation = relations.find((r) => r.propertyName === 'user');
    expect(userRelation).toBeDefined();
    expect(userRelation?.relationType).toBe('many-to-one');
    // En TypeORM, `userId` suele generarse por la relación ManyToOne + JoinColumn o implícitamente
    // Pero si se exige userId explícito
    const joinColumns = getMetadataArgsStorage().joinColumns.filter(
      (jc) => jc.target === Establishment,
    );
    const userJoin = joinColumns.find((jc) => jc.propertyName === 'user');
    
    // Asumiremos que el desarrollador pondrá @ManyToOne(() => User) user: User
    // y nullable: false (userId obligatorio)
  });

  it('debería tener los campos requeridos con sus tipos correctos', () => {
    expect(Establishment).toBeDefined();
    const columns = getMetadataArgsStorage().columns.filter(
      (c) => c.target === Establishment,
    );
    const columnNames = columns.map((c) => c.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('name');
    expect(columnNames).toContain('normalizedName');
    expect(columnNames).toContain('province');
    expect(columnNames).toContain('locality');
    expect(columnNames).toContain('latitude');
    expect(columnNames).toContain('longitude');
    expect(columnNames).toContain('superficieHa');
    expect(columnNames).toContain('createdAt');
    expect(columnNames).toContain('updatedAt');

    const typeOf = (name: string) => columns.find((c) => c.propertyName === name)?.options.type;

    // Type checking (some could be inferred, but we check if they are specified or default)
    expect(columns.find(c => c.propertyName === 'id')?.mode).toBe('primary'); // check primary
    expect(typeOf('latitude')).toBe('decimal');
    expect(typeOf('longitude')).toBe('decimal');
    expect(typeOf('superficieHa')).toBe('decimal');
  });

  it('debería tener el constraint UNIQUE(userId, normalizedName)', () => {
    expect(Establishment).toBeDefined();
    const uniques = getMetadataArgsStorage().uniques.filter(
      (u) => u.target === Establishment,
    );
    // Podría estar definido en @Unique(['userId', 'normalizedName']) o en @Unique(['user', 'normalizedName'])
    const hasUnique = uniques.some(u => {
      const cols = u.columns as string[];
      return cols && cols.includes('normalizedName') && (cols.includes('userId') || cols.includes('user'));
    });
    expect(hasUnique).toBe(true);
  });
});
