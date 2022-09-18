import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { DatabaseModule } from '../db/database.module';
import { groupProviders } from './group.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...groupProviders, GroupService],
  exports: [GroupService],
})
export class GroupModule {}
