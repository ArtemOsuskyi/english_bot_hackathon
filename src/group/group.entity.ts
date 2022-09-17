import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SkillLevel } from '../enums/skillLevel.enum';
import { User } from '../users/user.entity';
import { Teacher } from '../teachers/teachers.entity';

@Entity({ name: 'group' })
export class Group {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  @Column({ name: 'skill_level', type: 'enum', enum: SkillLevel })
  language_skill: SkillLevel;

  @OneToMany(() => User, (user) => user.group, {
    nullable: true,
  })
  students: User[];

  @ManyToOne(() => Teacher, (teacher) => teacher.groups, {
    nullable: true,
  })
  teacher: Teacher;
}
