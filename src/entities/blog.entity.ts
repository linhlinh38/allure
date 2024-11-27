import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";

@Entity("blogs")
export class Blog extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  title: string; // Title of the blog

  @Column({ type: "text", nullable: false })
  content: string; // Content of the blog

  @ManyToOne(() => Account, (account) => account.feedbacks)
  account: Account;
}
