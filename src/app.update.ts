import { Command, Hears, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Context as TelegraphContext, Telegraf } from 'telegraf';

import { BotCommands } from './enums/botCommants';
import {
  actionButtons,
  daysButtons,
  levelOfEnglishButtons,
  prefferedLessonsButton,
  timeButtons,
} from './app.buttons';
import { UsersService } from './users/users.service';
import { SkillLevel } from './enums/skillLevel.enum';
import { TypeOfLessons } from './enums/typeOfLessons.enum';
import { GroupService } from './group/group.service';
import { IndividualService } from './individual/individual.service';
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
          : BotCommands.GET_GROUP_PRICE),
    );
  }

  return options.map((o) => o).join('\n');
};

interface Context extends TelegraphContext {
  session: {
    type?: 'day' | 'time' | null | 'choose time' | 'choose day' | 'enter name';
  };
}

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly userService: UsersService,
    private readonly groupService: GroupService,
    private readonly individualService: IndividualService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi! ' + ctx.message.from.first_name);

    const user = await this.userService.getOneByTelegramId(ctx.from.id);

    if (!user) {
      await ctx.reply(
        `I don't see you in the database, so I need some information to provide you with the services you need.`,
      );
      await ctx.reply('Please enter your full name (first & last name).');
      ctx.session.type = 'enter name';
    }

    if (user) {
      await ctx.reply('What do you want to do?', actionButtons());
    }
  }

  @Hears('Info about my group')
  async infoAboutGroup(ctx: Context) {
    const user = await this.userService.getOneByTelegramId(ctx.from.id);

    if (user.group) {
      const group = await this.groupService.getOneById(user.group.id);
      return `Your group info:
      Skill level: ${group.language_skill}
      Day and time: ${group.daysAndTimes.map((dayAndTime) => {
        return `${dayAndTime.day} - ${dayAndTime.time}`;
      })}
      Teacher: ${group.teacher.firstName} ${group.teacher.lastName}
      Teacher phone: ${group.teacher.phone}
      Students: 
         ${group.students.map(
           (student) => ' ' + student.firstName + ' ' + student.lastName,
         )}`;
    } else {
      return `You don't have group`;
    }
  }

  @Hears('Info about my individual lessons')
  async infoAboutIndividual(ctx: Context) {
    const user = await this.userService.getOneByTelegramId(ctx.from.id);

    if (user.individual) {
      const individual = await this.individualService.getOneById(
        user.individual.id,
      );

      return `Your individual info:
      Skill level: ${individual.skill_level}
      Teacher: ${individual.teacher?.firstName} ${individual.teacher?.lastName}
      Teacher phone: ${individual.teacher.phone}
      Day and time:${individual.daysAndTimes?.map(
        (dayAndTime) => ` ${dayAndTime.day} - ${dayAndTime.time}`,
      )}
      `;
    } else {
      return `You don't have individual lessons`;
    }
  }

  @Hears('Get groups info')
  async groupsInfo(ctx: Context) {
    const result = await this.groupService.getAll();
    if (!result) {
      await ctx.reply('Unable to get groups info');
      return;
    }
    if (result && !result.length) {
      await ctx.reply('No groups found');
      return;
    }

    /* result.forEach(r => {
      r.
      await ctx.reply(``)
    }) */
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
    await ctx.reply('Choose day:', daysButtons());
    ctx.session.type = 'choose day';
  }

  @Command(BotCommands.CHOOSE_TIME)
  async chooseTimeCommand(ctx: Context) {
    await ctx.reply('Choose time:', timeButtons());
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
  async setLevelOfEnglish(ctx: Context) {
    const languageSkill = await this.getMessage(ctx);

    await this.userService.update(ctx.from.id, {
      languageSkill,
    });

    await ctx.reply(
      `What types of lessons do you prefer?`,
      prefferedLessonsButton(),
    );
  }

  @Hears(Object.values(TypeOfLessons))
  async setTypeOfLesson(ctx: Context) {
    const preferredLessons = await this.getMessage(ctx);

    await this.userService.update(ctx.from.id, {
      preferredLessons,
    });

    await ctx.reply('Ok');
    await ctx.reply('What do you want to do?', actionButtons());
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

  @On('message')
  async message(ctx: Context) {
    const message: string = await this.getMessage(ctx);

    if (ctx.session.type === 'choose day') {
      // replace log with DB request
      ctx.reply(`you choose ${message}`, actionButtons());
      ctx.session.type = null;
    }

    if (ctx.session.type === 'choose time') {
      // replace log with DB request
      ctx.reply(`you choose ${message}`, actionButtons());
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

    const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;

    if (ctx.session.type === 'enter name' && regName.test(message)) {
      await this.userService.create({
        telegramId: ctx.from.id,
        firstName: message.slice(0, message.indexOf(' ')),
        lastName: message.slice(message.indexOf(' ') + 1),
      });

      await ctx.reply(
        'What is your level of English?',
        levelOfEnglishButtons(),
      );
    } else {
      if (!ctx.session.type) return;
    }
  }

  private async getMessage(ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ctx.message.text;
  }
}
