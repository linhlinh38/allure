import { Entity, Column, OneToMany, OneToOne, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { OrderDetail } from "./orderDetail.entity";
import { Account } from "./account.entity";

@Entity("feedbacks")
export class Feedback extends BaseEntity {
  @Column({ type: "integer", nullable: false })
  rating: string;

  @Column({ type: "varchar" })
  feedback: string;

  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.feedback)
  orderDetail: OrderDetail;

  @ManyToOne(() => Account, (account) => account.feedbacks)
  account: Account;
}
