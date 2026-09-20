import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Establishment } from './establishment.entity';
import { Herd } from './herd.entity';
import { Animal } from './animal.entity';

@Entity('livestock_events')
export class LivestockEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: 'MOVEMENT' | 'HEALTH' | 'FEEDING' | 'PURCHASE' | 'SALE' | 'DEATH' | 'COST' | 'OTHER';

  @Column()
  occurredAt!: Date;

  @Column({ nullable: true })
  animalCount!: number | null;

  @Column({ nullable: true })
  amount!: number | null;

  @Column({ nullable: true })
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

  @Column({ nullable: true })
  herdId!: string | null;

  @ManyToOne(() => Animal, { nullable: true })
  @JoinColumn({ name: 'animalId' })
  animal!: Animal | null;

  @Column({ nullable: true })
  animalId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
