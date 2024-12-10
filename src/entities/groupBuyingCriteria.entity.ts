import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GroupBuying } from './groupBuying.entity';
import { Voucher } from './voucher.entity';
import { GroupProduct } from './groupProduct.entity';
@Entity('group_buying_criterias')
export class GroupBuyingCriteria extends BaseEntity {
  @OneToOne(() => GroupBuying, (groupBuying) => groupBuying.criteria, {
    cascade: true,
  })
  groupBuying: GroupBuying;

  @ManyToOne(() => GroupProduct, (groupProduct) => groupProduct.criteria, {
    nullable: false,
  })
  groupProduct: GroupProduct;

  @ManyToOne(() => Voucher, (voucher) => voucher.criteria, { nullable: true })
  voucher: Voucher;
}
