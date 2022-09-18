import { User } from '../../users/user.entity';
import { Teacher } from '../../teachers/teachers.entity';
import { SkillLevel } from '../../enums/skillLevel.enum';

export class CreateIndividualDto {
  student: User;
  teacher: Teacher;
  skill_level: SkillLevel;
}
