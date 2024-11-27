import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Survey } from './survey.entity';
import { Booking } from './booking.entity';
import { StatusEnum } from '../utils/enum';

@Entity('submitted_survey')
export class SubmittedSurvey extends BaseEntity {
  @Column({ type: 'text'})
  answer: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Survey, (survey) => survey.submittedSurveys)
  survey: Survey;

  @ManyToOne(() => Booking, (booking) => booking.submittedSurveys)
  booking: Booking;

  @Column()
  submissionDate: Date;
}
