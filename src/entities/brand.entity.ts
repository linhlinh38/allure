import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StatusEnum } from '../utils/enum';
import { Account } from './account.entity';
import { Follows } from './follow.entity';
import { Expose } from 'class-transformer';

@Entity('brands')
export class Brand extends BaseEntity {
  @Expose()
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Expose()
  @Column({ type: 'varchar', length: 255 })
  logo: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: false })
  document: string;

  @Expose()
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ManyToMany(() => Account, (account) => account.brands)
  accounts: Account[];

  @OneToMany(() => Follows, (follows) => follows.brand)
  follows: Follows[];

  @Expose()
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Expose()
  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Expose()
  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'float', default: 0 })
  star: number;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.PENDING,
  })
  status: StatusEnum;
}
