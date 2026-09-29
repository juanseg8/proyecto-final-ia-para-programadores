import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Establishment } from './establishment.entity';

@Entity('ai_interactions')
export class AiInteraction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  establishmentId!: string;

  @Column('text')
  question!: string;

  @Column('text', { nullable: true })
  answer!: string | null;

  @Column('jsonb')
  contextJson!: any;

  @Column('jsonb')
  toolsJson!: any;

  @Column({ type: 'varchar', nullable: true })
  model!: string | null;

  @Column()
  guardrailPassed!: boolean;

  @Column({ type: 'varchar', nullable: true })
  errorCode!: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Establishment, { nullable: false })
  @JoinColumn({ name: 'establishmentId' })
  establishment!: Establishment;

  @CreateDateColumn()
  createdAt!: Date;
}
