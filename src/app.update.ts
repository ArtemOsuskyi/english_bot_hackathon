import { Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { levelOfEnglishButtons, prefferedLessonsButton } from './app.buttons';
import { UsersService } from './users/users.service';
import { SkillLevel } from './enums/skillLevel.enum';
import { TypeOfLessons } from './enums/typeOfLessons.enum';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly userService: UsersService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi! ' + ctx.message.from.first_name);

    const user = await this.userService.getOneByTelegramId(ctx.from.id);

    if (!user) {
      await ctx.reply(
        `I don't see you in the database, so I need some information to provide you with the services you need.`,
      );
      await ctx.reply(
        'What is your level of English?',
        levelOfEnglishButtons(),
      );
    }

    // if user exists in db
    // await ctx.reply('What do you want to do?', actionButtons());
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

  @Hears(Object.values(SkillLevel))
  async getLevelOfEnglish(ctx: Context) {
    const languageSkill = await this.getMessage(ctx);

    await this.userService.create({
      telegramId: ctx.from.id,
      telegramUsername: ctx.from.username,
      languageSkill,
    });

    await ctx.reply(
      `What types of lessons do you prefer?`,
      prefferedLessonsButton(),
    );
  }

  @Hears(Object.values(TypeOfLessons))
  async getTypeOfLesson(ctx: Context) {
    const preferredLessons = await this.getMessage(ctx);

    await this.userService.update(ctx.from.id, {
      preferredLessons,
    });

    await ctx.reply('Ok');
  }

  private async getMessage(ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ctx.message.text;
  }
}
