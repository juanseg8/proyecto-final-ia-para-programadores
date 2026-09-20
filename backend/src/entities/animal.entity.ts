import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Establishment } from './establishment.entity';
import { Herd } from './herd.entity';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  tag!: string;

  @Column()
  sex!: 'M' | 'F';

  @Column({ nullable: true })
  birthDate!: Date | null;

  @Column()
  status!: 'ACTIVE' | 'SOLD' | 'DEAD' | 'TRANSFERRED';

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
