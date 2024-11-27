import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Service } from "./service.entity";
import { StatusEnum } from "../utils/enum";
import { ResultSheetSection } from "./resultSheetSection.entity";

@Entity("result_sheets")
export class ResultSheet extends BaseEntity {
  @Column({ type: "varchar", length: 255, nullable: false })
  title: string; // Tên bảng kết quả

  @OneToMany(() => Service, (service) => service.resultSheet)
  services: Service[]; // Quan hệ 1-N với Service

  @OneToMany(() => ResultSheetSection, (section) => section.resultSheet)
  sections: ResultSheetSection[]; // Quan hệ 1-N với ResultSheetSection
  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;
}
