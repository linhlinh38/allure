import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";

@Entity("managers")
export class Manager extends BaseEntity {
  @OneToOne(() => Account)
  @JoinColumn({ name: "account" })
  account: Account;
}
