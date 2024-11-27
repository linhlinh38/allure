import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";
import { Survey } from "./survey.entity";
import { SubmittedSurvey } from "./submittedSurvey.entity";
// import { Survey } from "./survey.entity";
// import { ConsultantService } from "./consultantService.entity";

@Entity('bookings')
export class Booking extends BaseEntity {
  //   @ManyToOne(() => Account, (account) => account.bookings, { nullable: false })
  //   account: Account; // Quan hệ N-1 với Account

  //   @ManyToOne(() => Survey, (survey) => survey.bookings, { nullable: true })
  //   survey: Survey; // Quan hệ N-1 với Survey

  //   @ManyToOne(() => ConsultantService, (service) => service.bookings, {
  //     nullable: true,
  //   })
  //   consultantService: ConsultantService; // Quan hệ N-1 với ConsultantService

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalPrice: number; // Tổng giá trị booking

  @Column({ type: 'varchar', length: 50, nullable: false })
  paymentMethod: string; // Phương thức thanh toán (e.g., Credit Card, PayPal)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  payment: number; // Số tiền thanh toán

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date; // Thời gian bắt đầu

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date; // Thời gian kết thúc

  @Column({ type: 'text', nullable: true })
  record: string; // Ghi chú (record)

  @Column({ type: 'varchar', length: 50, nullable: true })
  serviceType: string; // Loại dịch vụ

  @Column({ type: 'varchar', length: 100, nullable: true })
  serviceName: string; // Tên dịch vụ

  @Column({ type: 'boolean', default: false })
  isFeedback: boolean; // Đã được feedback hay chưa

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'completed' | 'cancelled'; // Trạng thái booking

  @Column({
    type: 'enum',
    enum: ['scheduled', 'unscheduled'],
    default: 'unscheduled',
  })
  scheduleStatus: 'scheduled' | 'unscheduled'; // Trạng thái lịch hẹn

  @ManyToOne(() => Survey, (survey) => survey.bookings)
  survey: Survey;

  @OneToMany(
    () => SubmittedSurvey,
    (submittedSurvey) => submittedSurvey.booking
  )
  submittedSurveys: SubmittedSurvey[];
}
