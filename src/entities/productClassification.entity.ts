import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Product } from "./product.entity";
import { ClassificationTypeEnum, StatusEnum } from "../utils/enum";
import { BaseEntity } from "./base.entity";
import { PreOrderProduct } from "./preOrderProduct.entity";
import { CartItem } from "./cartItem.entity";
import { ProductImage } from "./productImage.entity";
import { ProductDiscount } from "./productDiscount.entity";

@Entity('product_classifications')
export class ProductClassification extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'varchar', nullable: true })
  color: string;

  @Column({ type: 'varchar', nullable: true })
  size: string;

  @Column({ type: 'varchar', nullable: true })
  other: string;

  @OneToMany(() => ProductImage, (image) => image.productClassification, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_classification_images' })
  images?: ProductImage[];

  @Column({ type: 'varchar'})
  sku: string;

  @Column({
    type: 'enum',
    enum: ClassificationTypeEnum,
    nullable: true,
  })
  type: ClassificationTypeEnum;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => PreOrderProduct, { nullable: true })
  @JoinColumn({ name: 'pre_order_product_id' })
  preOrderProduct: PreOrderProduct;

  @ManyToOne(() => ProductDiscount, { nullable: true })
  @JoinColumn({ name: 'product_discount_id' })
  productDiscount: ProductDiscount;

  @OneToMany(() => CartItem, (cartItem) => cartItem.productClassification, {
    nullable: true,
  })
  @JoinColumn({ name: 'cart_items' })
  cartItems?: CartItem[];

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
