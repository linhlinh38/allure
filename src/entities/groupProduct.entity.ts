import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StatusEnum } from '../utils/enum';
import { GroupBuyingCriteria } from './groupBuyingCriteria.entity';

@Entity('group_products')
export class GroupProduct extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string; 

  @Column({ type: 'text', nullable: true })
  description: string; 

  @OneToMany(() => GroupBuyingCriteria, (criteria) => criteria.groupProduct)
  criteria: GroupBuyingCriteria[];

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
