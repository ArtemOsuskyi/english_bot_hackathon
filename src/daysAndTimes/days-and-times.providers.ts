import { DataSource } from 'typeorm';
import { DaysAndTimes } from './days-and-times.entity';

export const daysAndTimesProviders = [
  {
    provide: 'DAYS_AND_TIMES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DaysAndTimes),
    inject: ['DATA_SOURCE'],
  },
];
