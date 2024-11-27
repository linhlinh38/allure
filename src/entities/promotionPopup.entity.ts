import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Promotion } from "./promotion.entity";
import { StatusEnum } from "../utils/enum";

@Entity("promotion_popups")
export class PromotionPopup extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  title: string; // Title of the popup

  @Column({ type: "varchar", nullable: true })
  image: string; // Popup image URL (optional)

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionPopups)
  promotion: Promotion; // One-to-Many relationship with Promotion

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
