import { Module } from '@nestjs/common';

import { DatabaseModule } from '../db/database.module';
import { daysAndTimesProviders } from './days-and-times.providers';
import { DaysAndTimesService } from './days-and-times.service';

@Module({
  imports: [DatabaseModule],
  providers: [...daysAndTimesProviders, DaysAndTimesService],
  exports: [DaysAndTimesService],
})
export class DaysAndTimesModule {}
