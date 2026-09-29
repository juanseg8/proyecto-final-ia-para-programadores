import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Establishment } from './establishment.entity';
import { Herd } from './herd.entity';
import { Animal } from './animal.entity';

@Entity('livestock_events')
export class LivestockEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  type!: 'MOVEMENT' | 'HEALTH' | 'FEEDING' | 'PURCHASE' | 'SALE' | 'DEATH' | 'COST' | 'OTHER' | 'PREGNANCY' | 'WEANING';

  @Column()
  occurredAt!: Date;

  @Column({ type: 'int', nullable: true })
  animalCount!: number | null;

  @Column({ type: 'decimal', nullable: true })
  amount!: number | null;

  @Column({ type: 'varchar', nullable: true })
  notes!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any> | null;

  @ManyToOne(() => Establishment, { nullable: false })
  @JoinColumn({ name: 'establishmentId' })
  establishment!: Establishment;

  @Column()
  establishmentId!: string;

  @ManyToOne(() => Herd, { nullable: true })
  @JoinColumn({ name: 'herdId' })
  herd!: Herd | null;

  @Column({ type: 'uuid', nullable: true })
  herdId!: string | null;

  @ManyToOne(() => Animal, { nullable: true })
  @JoinColumn({ name: 'animalId' })
  animal!: Animal | null;

  @Column({ type: 'uuid', nullable: true })
  animalId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
