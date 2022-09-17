import { SkillLevel } from '../../enums/skillLevel.enum';
import { TypeOfLessons } from '../../enums/typeOfLessons.enum';
import { Group } from '../../group/group.entity';

export class UpdateUserDto {
  telegramUsername?: string;
  languageSkill?: SkillLevel;
  preferredLessons?: TypeOfLessons;
  group?: Group;
}
