import { Module } from '@nestjs/common';

import { DatabaseModule } from '../db/database.module';
import { teacherProviders } from './teachers.providers';
import { TeachersService } from './teachers.service';

@Module({
  imports: [DatabaseModule],
  providers: [...teacherProviders, TeachersService],
  exports: [TeachersService],
})
export class TeacherModule {}
