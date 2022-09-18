import { DataSource } from 'typeorm';
import { Teacher } from './teachers.entity';

export const teacherProviders = [
  {
    provide: 'TEACHER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Teacher),
    inject: ['DATA_SOURCE'],
  },
];
