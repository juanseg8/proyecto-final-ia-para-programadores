import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Establishment } from './establishment.entity';

@Entity('herds')
export class Herd {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  activity!: 'CRIA' | 'RECRIA' | 'ENGORDE';

  @Column()
  productionSystem!: 'PASTOREO' | 'SEMI_INTENSIVO' | 'INTENSIVO';

  @Column({ default: true })
  active!: boolean;

  @ManyToOne(() => Establishment, { nullable: false })
  @JoinColumn({ name: 'establishmentId' })
  establishment!: Establishment;

  @Column()
  establishmentId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
