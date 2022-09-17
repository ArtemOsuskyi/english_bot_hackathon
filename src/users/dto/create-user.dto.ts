import { SkillLevel } from '../../enums/skillLevel.enum';

export class CreateUserDto {
  telegramId: number;
  telegramUsername: string;
  languageSkill: SkillLevel;
}
