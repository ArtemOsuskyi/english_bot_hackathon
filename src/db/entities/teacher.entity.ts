import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Group }                                             from './group.entity';

@Entity({name: 'teacher'})
export class Teacher {
  @PrimaryGeneratedColumn({name: 'id', type: 'int4'})
  id: number

  @Column({name: 'first_name', type: 'varchar', nullable: false})
  firstName: string

  @Column({name: 'last_name', type: 'varchar', nullable: false})
  lastName: string

  @Column({name: 'patronymic', type: 'varchar', nullable: false})
  patronymic: string

  @Column({name: 'phone', type: 'varchar', nullable: false})
  phone: string

  @OneToMany(() => Group, (group) => group.teacher, {
    nullable: true
  })
  groups: Group[]
}