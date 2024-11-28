import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { OrderEnum, StatusEnum } from "../utils/enum";
import { GroupBuying } from "./groupBuying.entity";
import { LiveStream } from "./livestream.entity";
import { Voucher } from "./voucher.entity";
import { Account } from "./account.entity";
import { OrderDetail } from "./orderDetail.entity";
import { Transaction } from "./transaction.entity";

@Entity("orders")
export class Order extends BaseEntity {
  @Column({ type: "double precision", nullable: false })
  totalPrice: number;

  @Column({ type: "double precision" })
  totalPriceDiscount: number;

  @Column({ type: "varchar", length: 255 })
  shippingAddress: string;

  @Column({ type: "varchar", length: 15, nullable: false })
  phone: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  paymentMethod: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  payment: string;

  @Column({
    type: "enum",
    enum: OrderEnum,
    default: OrderEnum.NORMAL,
  })
  type: OrderEnum;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => GroupBuying, (groupBuying) => groupBuying.orders, {
    nullable: true,
  })
  @JoinColumn({ name: "group_buying_id" })
  groupBuying: GroupBuying;

  @ManyToOne(() => LiveStream, (livestream) => livestream.orders)
  @JoinColumn({ name: "livestream_id" })
  livestream: LiveStream;

  @ManyToMany(() => Voucher, (voucher) => voucher.orders)
  @JoinTable({
    name: "order_voucher",
    joinColumn: { name: "order_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "voucher_id", referencedColumnName: "id" },
  })
  vouchers: Voucher[];

  @ManyToOne(() => Account, (account) => account.orders)
  @JoinColumn({ name: "accountId" })
  account: Account;

  @ManyToOne(() => Order, (order) => order.children, { nullable: true })
  parent: Order;

  @OneToMany(() => Order, (order) => order.parent)
  children: Order[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];

  @OneToOne(() => Transaction, (transaction) => transaction.order)
  transaction: Transaction; // Quan hệ 1-1 với Transaction
}
