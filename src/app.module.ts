import { Module } from '@nestjs/common';
import * as LocalSession from 'telegraf-session-local';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppUpdate } from './app.update';
import { UsersModule } from './users/users.module';
import { GroupModule } from './group/group.module';
import { TeacherModule } from './teachers/teacher.module';
import { IndividualModule } from './individual/individual.module';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '5442639512:AAHM4buCpzKQWZakzqWEA-irPRjUvhc0-RE',
      middlewares: [sessions.middleware()],
    }),
    UsersModule,
    GroupModule,
    TeacherModule,
    IndividualModule,
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
