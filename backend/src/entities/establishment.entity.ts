import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique, JoinColumn, getMetadataArgsStorage } from 'typeorm';
import { User } from './user.entity';

@Entity('establishments')
@Unique(['user', 'normalizedName'])
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  normalizedName!: string;

  @Column()
  province!: string;

  @Column()
  locality!: string;

  @Column({ type: 'decimal' })
  latitude!: number;

  @Column({ type: 'decimal' })
  longitude!: number;

  @Column({ type: 'decimal' })
  superficieHa!: number;

  @Column({ default: false })
  participatesInBenchmark!: boolean;

  @Column({ nullable: true })
  activity!: string | null;

  @Column({ nullable: true })
  productionSystem!: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

}

const idColumn = getMetadataArgsStorage().columns.find(c => c.target === Establishment && c.propertyName === 'id');
if (idColumn) {
  (idColumn as any).mode = 'primary';
}
