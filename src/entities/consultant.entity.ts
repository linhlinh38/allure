import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";

@Entity("consultants")
export class Consultant extends BaseEntity {
  @OneToOne(() => Account)
  @JoinColumn({ name: "account" })
  account: Account;

  @Column({ type: "integer", default: 0 })
  yoe: number;

  @Column("varchar", { array: true, default: [] })
  certificates: string[]; // array of file id
}
