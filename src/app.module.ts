import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';

import { AppUpdate } from './app.update';
import { AppService } from './app.service';

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '5751395911:AAFrtx9nwXx1SHkyYnNPnuy8cIlhFGFUPQA',
      middlewares: [sessions.middleware()],
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
