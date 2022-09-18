import { Markup } from 'telegraf';
import { SkillLevel } from './enums/skillLevel.enum';
import { TypeOfLessons } from './enums/typeOfLessons.enum';

export function actionButtons() {
  return Markup.keyboard([
    Markup.button.callback('List of my lessons', 'lessons_list'),
    Markup.button.callback('Skip lesson', 'skip_lesson'),
    Markup.button.callback('Put off lesson', 'put_off_lesson'),
    Markup.button.callback('Individual lesson', 'individual_lesson'),
    Markup.button.callback('Group lesson', 'group_lesson'),
    Markup.button.callback('Get lesson prices', 'lesson_prices'),
  ]);
}

export function levelOfEnglishButtons() {
  return Markup.keyboard(
    Object.values(SkillLevel).map((value) =>
      Markup.button.callback(value, value.toLowerCase()),
    ),
  );
}

export function prefferedLessonsButton() {
  return Markup.keyboard([
    Object.values(TypeOfLessons).map((value) =>
      Markup.button.callback(value, value),
    ),
  ]);
}
