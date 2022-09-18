import { GroupService } from './group/group.service';
import {
  Command,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
  Ctx,
} from 'nestjs-telegraf';
import { Context as TelegraphContext, Telegraf } from 'telegraf';

import { TypeOfLessons } from './enums/lessonTypes';
import { BotCommands } from './enums/botCommants';
import {
  actionButtons,
  levelOfEnglishButtons,
  prefferedLessonsButton,
} from './app.buttons';
import { UsersService } from './users/users.service';
import { SkillLevel } from './enums/skillLevel.enum';
import { LessonPrices } from './enums/prices';

export function pregMatch(regex, str) {
  return new RegExp(regex).test(str);
}

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

interface Context extends TelegraphContext {
  session: {
    type?: 'day' | 'time' | null | 'choose time' | 'choose day';
  };
}

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly userService: UsersService,
    private readonly groupsService: GroupService,
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

  @Hears('Get groups info')
  async groupsInfo(ctx: Context) {
    const result = await this.groupsService.getAll();
    if (!result) {
      await ctx.reply('Unable to get groups info');
      return;
    }
    if (result && !result.length) {
      await ctx.reply('No groups found');
      return;
    }

    result.forEach(async (r) => {
      await ctx.reply(
        `Date: $date\nLanguage skill: ${r.language_skill}\nTeacher: ${
          r.teacher
        }\nStudents: \n${r.students.map((s) => ` ${s.telegramUsername}\n`)}`,
      );
    });
  }

  @Hears('Get lesson prices')
  async getPrices(ctx: Context) {
    const prices = LessonPrices;
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

  @On('text')
  async chooseOption(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'choose day') {
      // replayse log with DB request
      console.log(message);
      ctx.session.type = null;
    }

    if (ctx.session.type === 'choose time') {
      // replayse log with DB request
      console.log(message);
      ctx.session.type = null;
    }

    if (ctx.session?.type === 'day') {
      const regexDay = /([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/gm;
      const currentDate = new Date();
      const currentDateToString =
        currentDate.getFullYear() +
        '-' +
        (+currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate();
      const currentDateServerFormat = Date.parse(currentDateToString);

      if (
        pregMatch(regexDay, message) &&
        !isNaN(Date.parse(message)) &&
        Date.parse(message) >= currentDateServerFormat
      ) {
        await ctx.reply(
          `Notification had been sending!\n${ctx.from.first_name.toUpperCase()} (${
            ctx.from.id
          }) will absent ${message}`,
        );
        ctx.session.type = null;
        return;
      } else {
        await ctx.reply(
          `Wrong date or date format.\nWrite day to next format: YYYY-MM-DD\nFor example: ${currentDateToString}`,
        );
      }
    }
  }

  @Hears('Individual lesson')
  async individualLesson(ctx: Context, showPrice?: boolean) {
    const result = await this.userService.update(ctx.message.from.id, {
      preferredLessons: TypeOfLessons.SOLO,
    });

    if (!result) {
      ctx.reply('Some error occured');
    }
    await ctx.reply('You choose individual lesson');
    await ctx.reply(getLessonOptions(TypeOfLessons.SOLO, showPrice));
  }

  @Hears('Group lesson')
  async groupLesson(ctx: Context, showPrice?: boolean) {
    const result = await this.userService.update(ctx.message.from.id, {
      preferredLessons: TypeOfLessons.GROUP,
    });

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
    await ctx.reply('Type convenient days to learn (monday, wednesday):');
    ctx.session.type = 'choose day';
  }

  @Command(BotCommands.CHOOSE_TIME)
  async chooseTimeCommand(ctx: Context) {
    await ctx.reply('Type convenient time to learn (11:00, 14:00):');
    ctx.session.type = 'choose time';
  }

  @Command(BotCommands.GET_GROUP_PRICE)
  async getGroupPriceCommand(ctx: Context) {
    const price = LessonPrices.GROUP;
    if (!price) {
      await ctx.reply("Can't get price right now, try again later");
      return;
    }
    await ctx.reply(`The group lesson price is ${price} грн`);
  }

  @Command(BotCommands.GET_INDIVIDUAL_PRICE)
  async getIndividualPriceCommand(ctx: Context) {
    const price = LessonPrices.SOLO;
    if (!price) {
      await ctx.reply("Can't get price right now, try again later");
      return;
    }
    await ctx.reply(`The individual lesson price is ${price} грн`);
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

  @Hears('Notify about absence')
  async notifyAboutAbsence(ctx: Context) {
    await ctx.reply('Write day when you will absent (format: YYYY-MM-DD): ');
    ctx.session.type = 'day';
  }

  @Hears('Restart')
  async startCommand2(ctx: Context) {
    await ctx.reply('Hi! ' + ctx.message.from.first_name.toUpperCase());
    await ctx.reply('What do you want to do?', actionButtons());
  }
}
