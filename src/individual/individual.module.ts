import { Module } from '@nestjs/common';

import { DatabaseModule } from '../db/database.module';
import { individualProviders } from './individual.providers';
import { IndividualService } from './individual.service';

@Module({
  imports: [DatabaseModule],
  providers: [...individualProviders, IndividualService],
  exports: [IndividualService],
})
export class IndividualModule {}
