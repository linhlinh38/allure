import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { StatusEnum } from "../utils/enum";
import { Booking } from "./booking.entity";
import { SurveyQuestion } from "./surveyQuestion.entity";
import { SubmittedSurvey } from "./submittedSurvey.entity";

@Entity("surveys")
export class Survey extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @OneToMany(() => Booking, (booking) => booking.survey)
  bookings: Booking[];

  @OneToMany(() => SurveyQuestion, (question) => question.survey)
  questions: SurveyQuestion[];

  @OneToMany(() => SubmittedSurvey, (submittedSurvey) => submittedSurvey.survey)
  submittedSurveys: SubmittedSurvey[];
}
