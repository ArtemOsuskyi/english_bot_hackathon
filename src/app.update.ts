import { Ctx, Hears, InjectBot, Message, On, Start, Update } from "nestjs-telegraf";
import { Telegraf } from 'telegraf';
import { BotContext } from './model/context.model';

import { AppService } from './app.service';
import { actionButtons } from './app.buttons';
import { pregMatch } from "./utils/utils";

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<BotContext>,
    private readonly appService: AppService
  ) {}

  @Start()
  async startCommand(ctx: BotContext) {
    await ctx.reply('Hi! ' + ctx.message.from.first_name.toUpperCase());
    await ctx.reply('What do you want to do?', actionButtons());
  }

  @Hears('List of my lessons')
  async getAll() {
    return 'List of lessons';
  }

  @Hears('Skip lesson')
  async skipLesson() {
    return 'Skip lesson';
  }

  @Hears('Put off lesson')
  async putOffLesson() {
    return 'Put off lesson';
  }

  @Hears('Notify about absence')
  async notifyAboutAbsence(ctx: BotContext) {
    await ctx.reply('Write day when you will absent (format: YYYY-MM-DD): ');
    ctx.session.type = 'day';
  }

  @Hears('Restart')
  async startCommand2(ctx: BotContext) {
    await ctx.reply('Hi! ' + ctx.message.from.first_name.toUpperCase());
    await ctx.reply('What do you want to do?', actionButtons());
  }

  @On('text')
  async getAbsentDay(@Message('text') message: string, @Ctx() ctx: BotContext) {
    if (!ctx.session?.type) return;

    if (ctx.session?.type === 'day') {
      const regexDay = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/gm;
      const currentDate = new Date();
      const currentDateToString = currentDate.getFullYear() + '-' + (+currentDate.getMonth() + 1) + '-' + currentDate.getDate();
      const currentDateServerFormat = Date.parse(currentDateToString);

      if ( pregMatch(regexDay, message) && !isNaN(Date.parse(message)) && Date.parse(message) >= currentDateServerFormat) {
        await ctx.reply(`Notification had been sending!\n${ctx.from.first_name.toUpperCase()} (${ctx.from.id}) will absent ${message}`);
        ctx.session.type = null;
        return;
      } else {
        await ctx.reply(`Wrong date or date format.\nWrite day to next format: YYYY-MM-DD\nFor example: ${currentDateToString}`);
      }
    }
  }
}
