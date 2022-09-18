import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../users/user.entity';
import { Teacher } from '../teachers/teachers.entity';
import { SkillLevel } from '../enums/skillLevel.enum';
import { DaysAndTimes } from '../daysAndTimes/days-and-times.entity';

@Entity({ name: 'solo' })
export class Individual {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  @OneToOne(() => User, (user) => user.individual)
  @JoinColumn()
  student: User;

  @OneToOne(() => Teacher, (teacher) => teacher.individual)
  @JoinColumn()
  teacher: Teacher;

  @Column({ name: 'skill_level', type: 'enum', enum: SkillLevel })
  skill_level: SkillLevel;

  @ManyToOne(() => DaysAndTimes, (daysAndTimes) => daysAndTimes.individual)
  daysAndTimes: DaysAndTimes[];
}
