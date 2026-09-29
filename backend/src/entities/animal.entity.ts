import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Establishment } from './establishment.entity';
import { Herd } from './herd.entity';

@Entity('animals')
@Unique(['establishmentId', 'tag'])
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tag!: string;

  @Column({ type: 'varchar' })
  sex!: 'M' | 'F';

  @Column({ type: 'date', nullable: true })
  birthDate!: Date | null;

  @Column({ type: 'varchar' })
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
