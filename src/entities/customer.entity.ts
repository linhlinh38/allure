import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";

@Entity("customers")
export class Customer extends BaseEntity {
  @OneToOne(() => Account)
  @JoinColumn({ name: "account" })
  account: Account;

  @Column({ type: "varchar", length: 255, nullable: false })
  address: string;

  @Column("varchar", { array: true, default: [] })
  followingBrands: string[]; // array of brand IDs
}
