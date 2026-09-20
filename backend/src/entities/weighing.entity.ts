import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Establishment } from './establishment.entity';
import { Herd } from './herd.entity';
import { Animal } from './animal.entity';

@Entity('weighings')
export class Weighing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  weighedAt!: Date;

  @Column({ type: 'decimal' })
  weightKg!: number;

  @Column({ nullable: true })
  notes!: string | null;

  @ManyToOne(() => Establishment, { nullable: false })
  @JoinColumn({ name: 'establishmentId' })
  establishment!: Establishment;

  @Column()
  establishmentId!: string;

  @ManyToOne(() => Herd, { nullable: false })
  @JoinColumn({ name: 'herdId' })
  herd!: Herd;

  @Column()
  herdId!: string;

  @ManyToOne(() => Animal, { nullable: false })
  @JoinColumn({ name: 'animalId' })
  animal!: Animal;

  @Column()
  animalId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
