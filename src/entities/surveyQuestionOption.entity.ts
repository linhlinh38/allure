import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { SurveyQuestion } from "./surveyQuestion.entity";
import { StatusEnum } from "../utils/enum";

@Entity("survey_question_options")
export class SurveyQuestionOption extends BaseEntity {
  @Column()
  option: string;

  @Column()
  orderIndex: number;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => SurveyQuestion, (question) => question.options)
  question: SurveyQuestion;
}
