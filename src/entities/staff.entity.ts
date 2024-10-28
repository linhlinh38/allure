import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";

@Entity("staffs")
export class Staff extends BaseEntity {
  @OneToOne(() => Account)
  @JoinColumn({ name: "account" })
  account: Account;
}
