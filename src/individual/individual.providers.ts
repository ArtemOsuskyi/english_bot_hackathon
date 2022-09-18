import { DataSource } from 'typeorm';
import { Individual } from './individual.entity';

export const individualProviders = [
  {
    provide: 'INDIVIDUAL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Individual),
    inject: ['DATA_SOURCE'],
  },
];
