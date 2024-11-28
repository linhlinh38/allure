import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./survey.entity";
import { SurveyQuestionOption } from "./surveyQuestionOption.entity";
import { StatusEnum } from "../utils/enum";
import { BaseEntity } from "./base.entity";
@Entity("survey_questions")
export class SurveyQuestion extends BaseEntity {
  @Column()
  type: string;

  @Column()
  question: string;

  @Column()
  orderIndex: number;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @OneToMany(() => SurveyQuestionOption, (option) => option.question)
  options: SurveyQuestionOption[];
}
