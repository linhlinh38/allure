import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { ResultSheet } from "./resultSheet.entity";
import { StatusEnum } from "../utils/enum";

@Entity("result_sheet_sections")
export class ResultSheetSection extends BaseEntity {
  @ManyToOne(() => ResultSheet, (resultSheet) => resultSheet.sections, {
    nullable: false,
  })
  resultSheet: ResultSheet; // Quan hệ N-1 với ResultSheet

  @Column({ type: "varchar", length: 255, nullable: false })
  title: string; // Tiêu đề của phần

  @Column({ type: "int", nullable: false })
  orderIndex: number; // Thứ tự sắp xếp của phần

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @CreateDateColumn()
  createdAt: Date; // Thời gian tạo

  @UpdateDateColumn()
  updatedAt: Date; // Thời gian cập nhật
}
