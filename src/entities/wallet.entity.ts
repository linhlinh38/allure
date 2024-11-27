import { Entity, Column, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";

@Entity("wallets")
export class Wallet extends BaseEntity {
  @Column({ type: "decimal", precision: 15, scale: 2, nullable: false })
  balance: number; // Số dư

  @Column({ type: "varchar", length: 10, nullable: false })
  currency: string; // Loại tiền tệ

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date; // Thời gian tạo ví

  @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
  status: "active" | "inactive"; // Trạng thái ví

  @OneToOne(() => Account, (account) => account.wallet)
  account: Account; // Quan hệ 1-1 với Account
}
