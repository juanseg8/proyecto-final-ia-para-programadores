import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Establishment } from './establishment.entity';
import { Herd } from './herd.entity';

@Entity('indicator_snapshots')
export class IndicatorSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  establishmentId!: string;

  @Column({ nullable: true })
  herdId!: string | null;

  @Column()
  periodFrom!: Date;

  @Column()
  periodTo!: Date;

  @Column({ type: 'decimal', nullable: true })
  gmdGramsDay!: number | null;

  @Column({ type: 'integer', nullable: true })
  activeHeadCount!: number | null;

  @Column({ type: 'decimal', nullable: true })
  stockingRateHeadsHa!: number | null;

  @Column({ type: 'decimal', nullable: true })
  mortalityPct!: number | null;

  @Column({ type: 'decimal', nullable: true })
  costPerKgProduced!: number | null;

  @Column()
  calculatedAt!: Date;

  @ManyToOne(() => Establishment, { nullable: false })
  @JoinColumn({ name: 'establishmentId' })
  establishment!: Establishment;

  @ManyToOne(() => Herd, { nullable: true })
  @JoinColumn({ name: 'herdId' })
  herd!: Herd | null;

  @CreateDateColumn()
  createdAt!: Date;
}
