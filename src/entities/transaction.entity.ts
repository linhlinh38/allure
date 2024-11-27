import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";
import { Order } from "./order.entity";

@Entity("transactions")
export class Transaction extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  from: string; // Người gửi

  @Column({ type: "varchar", length: 255, nullable: false })
  to: string; // Người nhận

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  amount: number; // Số tiền giao dịch

  @Column({ type: "enum", enum: ["debit", "credit"], nullable: false })
  type: "debit" | "credit"; // Loại giao dịch

  @Column({ type: "text", nullable: true })
  description: string; // Mô tả giao dịch

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date; // Thời gian giao dịch

  @ManyToOne(() => Account, (account) => account.transactions, {
    nullable: false,
  })
  account: Account; // Quan hệ 1-N với Account

  @OneToOne(() => Order, { nullable: true })
  @JoinColumn()
  order: Order; // Quan hệ 1-1 với Order
}
