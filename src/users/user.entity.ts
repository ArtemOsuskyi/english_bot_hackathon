import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SkillLevel } from '../enums/skillLevel.enum';
import { TypeOfLessons } from '../enums/typeOfLessons.enum';
import { Group } from '../group/group.entity';
import { Individual } from '../individual/individual.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  @Column({ name: 'telegram_id', type: 'int', nullable: false })
  telegramId: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({
    name: 'language_skill',
    type: 'enum',
    enum: SkillLevel,
    nullable: true,
  })
  languageSkill: SkillLevel;

  @Column({
    name: 'preferred_lessons',
    type: 'enum',
    enum: TypeOfLessons,
    nullable: true,
  })
  preferredLessons: TypeOfLessons;

  @ManyToOne(() => Group, (group) => group.students, {
    nullable: true,
  })
  group: Group;

  @OneToOne(() => Individual, (individual) => individual.student, {
    nullable: true,
  })
  individual: Individual;
}
