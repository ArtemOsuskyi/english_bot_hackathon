import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from '../group/group.entity';
import { Individual } from '../individual/individual.entity';
import { daysEnum } from '../enums/days.enum';

@Entity('days_and_times')
export class DaysAndTimes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.id, { nullable: true })
  @JoinColumn()
  group: Group;

  @ManyToOne(() => Individual, (individual) => individual.id, {
    nullable: true,
  })
  @JoinColumn()
  individual: Individual;

  @Column({ name: 'day', type: 'enum', enum: daysEnum })
  day: daysEnum;

  @Column()
  time: string;
}
