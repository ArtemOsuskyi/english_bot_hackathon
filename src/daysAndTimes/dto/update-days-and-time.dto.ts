import { daysEnum } from '../../enums/days.enum';

export class UpdateDaysAndTimeDto {
  day?: daysEnum;
  time?: string;
}
