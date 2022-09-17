import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Teacher } from '../teachers/teachers.entity';
import { SkillLevel } from '../enums/skillLevel.enum';

@Entity({ name: 'solo' })
export class Individual {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  @OneToOne(() => User)
  student: User;

  @OneToOne(() => Teacher)
  teacher: Teacher;

  @Column({ name: 'skill_level', type: 'enum', enum: SkillLevel })
  skill_level: SkillLevel;
}
