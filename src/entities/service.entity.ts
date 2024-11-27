import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { ConsultantService } from "./consultantService.entity";
import { Category } from "./category.entity";
import { ResultSheet } from "./resultSheet.entity";

@Entity("services")
export class Service extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  name: string; // Tên dịch vụ

  @Column({ type: "text", nullable: true })
  description: string; // Mô tả dịch vụ

  @Column({ type: "enum", enum: ["type1", "type2", "type3"], nullable: false })
  type: string; // Loại dịch vụ (Ví dụ: type1, type2, type3)

  @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
  status: "active" | "inactive"; // Trạng thái dịch vụ

  @ManyToOne(() => Category, (category) => category.services, {
    nullable: false,
  })
  category: Category; // Quan hệ N-1 với Category

  @ManyToOne(() => ResultSheet, (resultSheet) => resultSheet.services, {
    nullable: true,
  })
  resultSheet: ResultSheet; // Quan hệ N-1 với ResultSheet

  @OneToMany(
    () => ConsultantService,
    (consultantService) => consultantService.service
  )
  consultantServices: ConsultantService[]; // Quan hệ 1-N với ConsultantService
}
