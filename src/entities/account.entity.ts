import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { GenderEnum, RoleEnum, StatusEnum } from "../utils/enum";

@Entity("accounts")
export class Account extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  firstName: string;

  @Column({ type: "varchar", length: 100 })
  lastName: string;

  @Column({ type: "varchar", length: 100, unique: true })
  username: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.CUSTOMER,
  })
  role: RoleEnum;

  @Column({
    type: "enum",
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone: string;

  @Column({ type: "timestamp", nullable: true })
  dob: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar: string;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
