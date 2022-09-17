import { Command, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { AppService } from './app.service';
import { actionButtons } from './app.buttons';
import { TypeOfLessons } from './enums/lessonTypes';
import { BotCommands } from './enums/botCommants';

const getLessonOptions = (type: TypeOfLessons, showPrice?: boolean) => {
  const options = [
    `Choose lesson day: \n${BotCommands.CHOOSE_DAY}`,
    `Choose lesson time: \n${BotCommands.CHOOSE_TIME}`,
  ];
  if (showPrice) {
    options.push(
      'Get lesson price: \n' +
        (type === TypeOfLessons.SOLO
          ? BotCommands.GET_INDIVIDUAL_PRICE
          : BotCommands.GET_INDIVIDUAL_PRICE),
    );
  }

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

  @Hears('Get lesson prices')
  async getPrices(ctx: Context) {
    const prices = await this.appService.getAllPrices();
    if (prices.GROUP) {
      await ctx.reply(
        `Group lesson price - ${prices.GROUP} грн\nChoose group lesson: ${BotCommands.GROUP}`,
      );
    }
    if (prices.SOLO) {
      await ctx.reply(
        `Individual lesson price - ${prices.SOLO} грн\nChoose individual lesson: ${BotCommands.INDIVIDUAL}`,
      );
      return;
    }
    await ctx.reply('Unable to get lesson prices');
  }

  @Hears('Individual lesson')
  async individualLesson(ctx: Context, showPrice?: boolean) {
    const result = await this.appService.chooseLessonType(TypeOfLessons.SOLO);
    if (!result) {
      ctx.reply('Some error occured');
    }
    await ctx.reply('You choose individual lesson');
    await ctx.reply(getLessonOptions(TypeOfLessons.SOLO, showPrice));
  }

  @Hears('Group lesson')
  async groupLesson(ctx: Context, showPrice?: boolean) {
    const result = await this.appService.chooseLessonType(TypeOfLessons.GROUP);
    if (!result) {
      ctx.reply('Some error occured');
    }
    await ctx.reply('You choose group lesson');
    await ctx.reply(getLessonOptions(TypeOfLessons.GROUP, showPrice));
  }

  @Command(BotCommands.INDIVIDUAL)
  async chooseIndividualLessonCommand(ctx: Context) {
    this.individualLesson(ctx);
  }

  @Command(BotCommands.GROUP)
  async chooseGroupLessonCommand(ctx: Context) {
    this.groupLesson(ctx);
  }

  @Command(BotCommands.CHOOSE_DAY)
  async chooseDayCommand(ctx: Context) {
    // hears function to choose day
    return 'choose_day';
  }

  @Command(BotCommands.CHOOSE_TIME)
  async chooseTimeCommand(ctx: Context) {
    // hears function to choose time
    return 'choose_time';
  }

  @Command(BotCommands.GET_GROUP_PRICE)
  async getGroupPriceCommand(ctx: Context) {
    const price = this.appService.getLessonPrice(TypeOfLessons.GROUP);
    if (!price) {
      await ctx.reply("Can't get price right now, try again later");
      return;
    }
    await ctx.reply(`The group lesson price is ${price} грн`);
  }

  @Command(BotCommands.GET_INDIVIDUAL_PRICE)
  async getIndividualPriceCommand(ctx: Context) {
    const price = this.appService.getLessonPrice(TypeOfLessons.SOLO);
    if (!price) {
      await ctx.reply("Can't get price right now, try again later");
      return;
    }
    await ctx.reply(`The individual lesson price is ${price} грн`);
  }
}
