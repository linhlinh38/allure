import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEnum, StatusEnum } from '../utils/enum';
import { GroupBuying } from './groupBuying.entity';
import { LiveStream } from './livestream.entity';
import { Voucher } from './voucher.entity';
import { Account } from './account.entity';
import { OrderDetail } from './orderDetail.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'double precision', nullable: false })
  totalPrice: number;

  @Column({ type: 'double precision' })
  totalPriceDiscount: number;

  @Column({ type: 'varchar', length: 255 })
  shippingAddress: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 255 })
  notes: string;

  @Column({
    type: 'enum',
    enum: OrderEnum,
    default: OrderEnum.NORMAL,
  })
  type: OrderEnum;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => GroupBuying, (groupBuying) => groupBuying.orders, {
    nullable: true,
  })
  @JoinColumn({ name: 'group_buying_id' })
  groupBuying: GroupBuying;

  @ManyToOne(() => LiveStream, (livestream) => livestream.orders, {
    nullable: true,
  })
  @JoinColumn({ name: 'livestream_id' })
  livestream: LiveStream;

  @ManyToMany(() => Voucher, (voucher) => voucher.orders)
  @JoinTable({
    name: 'order_voucher',
    joinColumn: { name: 'order_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'voucher_id', referencedColumnName: 'id' },
  })
  vouchers: Voucher[];

  @ManyToOne(() => Account, (account) => account.orders)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Order, (order) => order.children, { nullable: true })
  parent: Order;

  @OneToMany(() => Order, (order) => order.parent, { cascade: true })
  children: Order[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  orderDetails: OrderDetail[];
}
