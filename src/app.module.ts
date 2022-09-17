import { Module } from '@nestjs/common';
import * as LocalSession from 'telegraf-session-local';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppUpdate } from './app.update';
import { UsersModule } from './users/users.module';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '5454765552:AAHTly3uWBheBAv7ta2lLbWSi-NZomTi-3A',
      middlewares: [sessions.middleware()],
    }),
    UsersModule,
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
