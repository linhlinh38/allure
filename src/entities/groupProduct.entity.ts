import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { GroupBuyingCriteria } from "./groupBuyingCriteria.entity";
import { StatusEnum } from "../utils/enum";

@Entity("group_products")
export class GroupProduct extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  name: string; // Name of the group product

  @Column({ type: "text", nullable: true })
  description: string; // Description of the group product (optional)

  @OneToMany(() => GroupBuyingCriteria, (criteria) => criteria.groupProduct)
  criteria: GroupBuyingCriteria[];

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
