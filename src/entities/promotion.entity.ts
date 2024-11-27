import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Brand } from "./brand.entity";
import { Voucher } from "./voucher.entity";
import { StatusEnum } from "../utils/enum";
import { PromotionPopup } from "./promotionPopup.entity";

@Entity("promotions")
export class Promotion extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  title: string; // Title of the promotion

  @Column({ type: "varchar", nullable: true })
  banner: string; // Banner image URL (optional)

  @Column({ type: "timestamp", nullable: false })
  startTime: Date; // Start time of the promotion

  @Column({ type: "timestamp", nullable: false })
  endTime: Date; // End time of the promotion

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Brand, (brand) => brand.promotions)
  brand: Brand; // One-to-Many relationship with Brand

  @ManyToMany(() => Voucher, (voucher) => voucher.promotions)
  @JoinTable()
  vouchers: Voucher[]; // Many-to-Many relationship with Voucher

  @OneToMany(() => PromotionPopup, (popup) => popup.promotion)
  promotionPopups: PromotionPopup[]; // One-to-Many relationship with PromotionPopup
}
