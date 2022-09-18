import { Teacher } from '../../teachers/teachers.entity';
import { SkillLevel } from '../../enums/skillLevel.enum';

export class UpdateIndividualDto {
  teacher?: Teacher;
  skill_level?: SkillLevel;
}
