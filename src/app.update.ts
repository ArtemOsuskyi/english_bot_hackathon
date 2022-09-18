import { Hears, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import {
  actionButtons,
  levelOfEnglishButtons,
  prefferedLessonsButton,
} from './app.buttons';
import { UsersService } from './users/users.service';
import { SkillLevel } from './enums/skillLevel.enum';
import { TypeOfLessons } from './enums/typeOfLessons.enum';
import { GroupService } from './group/group.service';
import { IndividualService } from './individual/individual.service';

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
      Teacher: ${group.teacher?.firstName} ${group.teacher?.lastName}
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
      return `Your group info:
      Skill level: ${individual.skill_level}
      Teacher: ${individual.teacher?.firstName} ${individual.teacher?.lastName}
      Teacher phone: ${individual.teacher.phone}`;
    } else {
      return `You don't have individual lessons`;
    }
  }

  @Hears('Put off lesson')
  async putOffLesson() {
    return 'Put off lesson';
  }

  @Hears(Object.values(SkillLevel))
  async getLevelOfEnglish(ctx: Context) {
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
  async getTypeOfLesson(ctx: Context) {
    const preferredLessons = await this.getMessage(ctx);

    await this.userService.update(ctx.from.id, {
      preferredLessons,
    });

    await ctx.reply('Ok');
    await ctx.reply('What do you want to do?', actionButtons());
  }

  @On('message')
  async message(ctx: Context) {
    const message: string = await this.getMessage(ctx);

    const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;

    if (regName.test(message)) {
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
      return `Please, don't send unnecessary messages!`;
    }
  }

  private async getMessage(ctx: Context) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return ctx.message.text;
  }
}
