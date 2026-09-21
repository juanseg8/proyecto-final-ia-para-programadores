import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Establishment } from './establishment.entity';

@Entity('benchmark_snapshots')
export class BenchmarkSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  establishmentId!: string;

  @Column()
  periodFrom!: Date;

  @Column()
  periodTo!: Date;

  @Column({ type: 'decimal' })
  median!: number;

  @Column({ type: 'decimal' })
  p25!: number;

  @Column({ type: 'decimal' })
  p75!: number;

  @Column({ type: 'integer' })
  peerGroupSize!: number;

  @Column({ type: 'decimal' })
  relativePosition!: number;

  @Column('jsonb')
  criteria!: {
    activity: string;
    system: string;
    region: string;
    scaleRange: number;
    period: string;
  };

  @ManyToOne(() => Establishment, { nullable: false })
  @JoinColumn({ name: 'establishmentId' })
  establishment!: Establishment;

  @CreateDateColumn()
  createdAt!: Date;
}
