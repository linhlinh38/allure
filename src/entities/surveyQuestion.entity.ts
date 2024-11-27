import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Survey } from './survey.entity';
import { SurveyQuestionOption } from './surveyQuestionOption.entity';
import { StatusEnum } from '../utils/enum';

@Entity('survey_question')
export class SurveyQuestion extends BaseEntity {
  @Column()
  type: string;

  @Column()
  question: string;

  @Column()
  orderIndex: number;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @OneToMany(() => SurveyQuestionOption, (option) => option.question)
  options: SurveyQuestionOption[];
}
