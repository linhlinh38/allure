import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";

@Entity("kols")
export class KOL extends BaseEntity {
  @OneToOne(() => Account)
  @JoinColumn({ name: "account" })
  account: Account;

  @Column({ type: "integer", default: 0 })
  yoe: number;

  @Column("varchar", { array: true, default: [] })
  certificates: string[]; // array of file id
}
