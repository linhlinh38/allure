import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { GenderEnum, RoleEnum, StatusEnum } from "../utils/enum";
import { Address } from "./address.entity";
import { File } from "./file.entity";
import { Role } from "./role.entity";
import { Brand } from "./brand.entity";
import { Follow } from "./follow.entity";
import { Order } from "./order.entity";
import { Feedback } from "./feedback.entity";
import { CartItem } from "./cartItem.entity";
import { Blog } from "./blog.entity";
import { Wallet } from "./wallet.entity";
import { Transaction } from "./transaction.entity";
import { ConsultantService } from "./consultantService.entity";
import { Booking } from "./booking.entity";

@Entity("accounts")
export class Account extends BaseEntity {
  @Column({ type: "varchar", length: 100, nullable: true })
  firstName: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  lastName: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: true })
  username?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  avatar?: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  email: string;

  @Column({ name: "is_email_verify", type: "boolean", default: false })
  isEmailVerify: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  password: string;

  @ManyToOne(() => Role, (role) => role.accounts)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @Column({
    type: "enum",
    enum: GenderEnum,
    nullable: true,
  })
  gender: GenderEnum;

  @Column({ type: "varchar", length: 15, nullable: true })
  phone?: string;

  @Column({ type: "timestamp", nullable: true })
  dob?: Date;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.PENDING,
  })
  status: StatusEnum;

  @Column({ type: "bigint", nullable: true })
  yoe: number;

  @OneToMany(() => Address, (address) => address.account, { nullable: true })
  addresses?: Address[];

  @OneToMany(() => File, (file) => file.account, { nullable: true })
  files?: File[];

  @ManyToMany(() => Brand, (brand) => brand.accounts)
  @JoinTable({
    name: "account_brand_role",
    joinColumn: { name: "account_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "brand_id", referencedColumnName: "id" },
  })
  brands: Brand[];

  @OneToMany(() => Follow, (follows) => follows.account)
  follows: Follow[];

  @OneToMany(() => Order, (order) => order.account)
  orders: Order[];

  @OneToMany(() => Feedback, (feedback) => feedback.account)
  feedbacks: Feedback[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.account, { nullable: true })
  @JoinColumn({ name: "cart_items" })
  cartItems?: CartItem[];

  @OneToMany(() => Blog, (blog) => blog.account)
  blogs: Blog[]; // One-to-Many relationship with Blog

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[]; // Quan hệ 1-N với Transaction

  @OneToOne(() => Wallet, (wallet) => wallet.account, { cascade: true })
  @JoinColumn()
  wallet: Wallet; // Quan hệ 1-1 với Wallet

  @OneToMany(
    () => ConsultantService,
    (consultantService) => consultantService.account
  )
  consultantServices: ConsultantService[]; // Quan hệ 1-N với ConsultantService

  @OneToMany(() => Booking, (booking) => booking.account)
  bookings: Booking[]; // Quan hệ 1-M với Booking
}
