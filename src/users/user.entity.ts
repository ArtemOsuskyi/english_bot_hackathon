import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SkillLevel } from '../enums/skillLevel.enum';
import { TypeOfLessons } from '../enums/typeOfLessons.enum';
import { Group } from '../group/group.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int4' })
  id: number;

  @Column({ name: 'telegram_id', type: 'int', nullable: false })
  telegramId: number;

  @Column({ name: 'telegram_username', type: 'varchar', nullable: false })
  telegramUsername: string;

  @Column({ name: 'language_skill', type: 'enum', enum: SkillLevel })
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
}
