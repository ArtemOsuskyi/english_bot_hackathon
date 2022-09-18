import { DataSource } from 'typeorm';

import { User } from '../users/user.entity';
import { Teacher } from '../teachers/teachers.entity';
import { Individual } from '../individual/individual.entity';
import { Group } from '../group/group.entity';
import { DaysAndTimes } from '../daysAndTimes/days-and-times.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5430,
        username: 'postgres',
        password: 'password',
        database: 'postgresDB',
        entities: [User, Teacher, Individual, Group, DaysAndTimes],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
