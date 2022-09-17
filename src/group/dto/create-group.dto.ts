import { SkillLevel } from '../../enums/skillLevel.enum';
import { User } from '../../users/user.entity';
import { Teacher } from '../../teachers/teachers.entity';

export class CreateGroupDto {
  language_skill: SkillLevel;
  students: User[];
  teacher: Teacher;
}
