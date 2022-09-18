import { Group } from '../../group/group.entity';
import { Individual } from '../../individual/individual.entity';
import { daysEnum } from '../../enums/days.enum';

export class CreateDaysAndTimesDto {
  group: Group;
  individual: Individual;
  day: daysEnum;
  time: string;
}
