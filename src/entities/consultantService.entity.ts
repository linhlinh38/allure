import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Account } from "./account.entity";
// import { Survey } from "./survey.entity";

import { Booking } from "./booking.entity";
import { Service } from "./service.entity";
import { StatusEnum } from "../utils/enum";

@Entity("consultant_services")
export class ConsultantService extends BaseEntity {
  @ManyToOne(() => Account, (account) => account.consultantServices, {
    nullable: false,
  })
  account: Account; // Quan hệ N-1 với Account

  //   @ManyToOne(() => Survey, (survey) => survey.consultantServices, {
  //     nullable: true,
  //   })
  //   survey: Survey; // Quan hệ N-1 với Survey

  @ManyToOne(() => Service, (service) => service.consultantServices, {
    nullable: false,
  })
  service: Service; // Quan hệ N-1 với Service

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number; // Giá dịch vụ

  @OneToMany(() => Booking, (booking) => booking.consultantService)
  bookings: Booking[]; // Quan hệ 1-M với Booking

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
