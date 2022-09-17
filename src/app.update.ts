import { Command, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { AppService } from './app.service';
import { actionButtons } from './app.buttons';
import { LessonTypes } from './enums/lessonTypes';

const getLessonOptions = (type: LessonTypes) => {
  const options = [
    'Choose lesson day: \n/choose_day',
    'Choose lesson time: \n/choose_time',
  ];
  options.push(
    'Get lesson price: \n' +
      (type === LessonTypes.Solo
        ? '/get_individual_price'
        : '/get_group_price'),
  );
  return options.map((o) => o).join('\n');
};

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommend(ctx: Context) {
    await ctx.reply('Hi! ' + ctx.message.from.id);
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

  @Hears('Individual lesson')
  async individualLesson(ctx: Context) {
    await this.appService.chooseLessonType(LessonTypes.Solo);
    await ctx.reply('You choose individual lesson');
    await ctx.reply(getLessonOptions(LessonTypes.Solo));
  }

  @Hears('Group lesson')
  async groupLesson(ctx: Context) {
    await this.appService.chooseLessonType(LessonTypes.Group);
    await ctx.reply('You choose group lesson');
    await ctx.reply(getLessonOptions(LessonTypes.Group));
  }

  @Command('/choose_day')
  async chooseDayCommand(ctx: Context) {
    // hears function to choose day
    return 'choose_day';
  }

  @Command('/choose_time')
  async chooseTimeCommand(ctx: Context) {
    // hears function to choose time
    return 'choose_time';
  }

  @Command('/get_group_price')
  async getGroupPriceCommand(ctx: Context) {
    // hears function to get price
    return 'get_group_price';
  }

  @Command('/get_individual_price')
  async getIndividualPriceCommand(ctx: Context) {
    // hears function to get price
    return 'get_individual_price';
  }
}
