import { Module }          from '@nestjs/common';
import { AppService }      from './app.service';
import { TelegrafModule }  from 'nestjs-telegraf';
import { config }          from 'dotenv';
import { AppUpdate }       from './app.update';
import { TypeOrmModule }   from '@nestjs/typeorm';
import { TypeOrmExModule } from './db/typeorm_ex.module';

config();

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_TOKEN,
      middlewares: [],
    }),
    TypeOrmModule.forRootAsync({

    })
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
