import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { GenderEnum, RoleEnum, StatusEnum } from "../utils/enum";
import { Address } from "./address.entity";
import { File } from "./file.entity";
import { Role } from "./role.entity";

@Entity("accounts")
export class Account extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  firstName: string;

  @Column({ type: "varchar", length: 100 })
  lastName: string;

  @Column({ type: "varchar", length: 100, unique: true })
  username?: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @ManyToOne(() => Role, (role) => role.accounts)
  @JoinColumn({ name: "roleId" })
  role: Role;

  @Column({
    type: "enum",
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone?: string;

  @Column({ type: "timestamp", nullable: true })
  dob?: Date;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Column({ type: "integer", nullable: true })
  yoe: number;

  @OneToMany(() => Address, (address) => address.account, { nullable: true })
  addresses?: Address[];

  @OneToMany(() => File, (file) => file.account, { nullable: true })
  files?: File[];
}
