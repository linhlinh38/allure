import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { LiveStream } from './livestream.entity';
import { ProductClassification } from './productClassification.entity';
import { ProductDiscount } from './productDiscount.entity';
import { Order } from './order.entity';
import { Feedback } from './feedback.entity';

@Entity('order_details')
export class OrderDetail extends BaseEntity {
  @Column({ type: 'double precision', nullable: false })
  price: number;

  @Column({ type: 'double precision' })
  discount: number;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'boolean' })
  isFeedback: boolean;

  @ManyToOne(() => ProductDiscount)
  productDiscount: ProductDiscount;

  @ManyToOne(() => ProductClassification)
  productClassification: ProductClassification;

  @ManyToOne(() => ProductClassification)
  productClassificationPreOrder: ProductClassification;

  @ManyToOne(() => LiveStream, (livestream) => livestream.orders)
  @JoinColumn({ name: 'livestream_id' })
  livestream: LiveStream;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @OneToOne(() => Feedback, (feedback) => feedback.orderDetail, {
    nullable: true,
  })
  @JoinColumn({ name: 'feedback_id' }) 
  feedback: Feedback;
}
