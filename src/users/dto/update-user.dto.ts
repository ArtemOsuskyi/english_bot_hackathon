import { SkillLevel } from '../../enums/skillLevel.enum';
import { TypeOfLessons } from '../../enums/typeOfLessons.enum';
import { Group } from '../../group/group.entity';
import { Individual } from '../../individual/individual.entity';

export class UpdateUserDto {
  languageSkill?: SkillLevel;
  preferredLessons?: TypeOfLessons;
  group?: Group;
  individual?: Individual;
}
