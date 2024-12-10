import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./product.entity";
import { ProductDiscountEnum } from "../utils/enum";
import { BaseEntity } from "./base.entity";

@Entity("product_discounts")
export class ProductDiscount extends BaseEntity {
  @Column({ type: "varchar" })
  startTime: string;

  @Column({ type: "varchar" })
  endTime: string;

  @Column({ type: "int" })
  discount: number;

  @OneToMany(
    () => ProductClassification,
    (productClassification) => productClassification.productDiscount
  )
  @JoinColumn({ name: "product_classifications" })
  productClassifications: ProductClassification[];

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({
    type: "enum",
    enum: ProductDiscountEnum,
    default: ProductDiscountEnum.WAITING,
  })
  status: ProductDiscountEnum;
}
