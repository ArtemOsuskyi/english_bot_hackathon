import { DataSource } from 'typeorm';

import { User } from '../users/user.entity';
import { Teacher } from '../teachers/teachers.entity';
import { Individual } from '../individual/individual.entity';
import { Group } from '../group/group.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'postgresDB',
        entities: [User, Teacher, Individual, Group],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
