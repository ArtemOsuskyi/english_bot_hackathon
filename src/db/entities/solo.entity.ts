import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'solo'})
export class Solo {
  @PrimaryGeneratedColumn({name: 'id', type: 'int4'})
  id: number

}