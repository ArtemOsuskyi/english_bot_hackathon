import { Markup } from 'telegraf';
import { SkillLevel } from './enums/skillLevel.enum';
import { TypeOfLessons } from './enums/typeOfLessons.enum';

export function actionButtons() {
  return Markup.keyboard([
    Markup.button.callback('Info about my group', 'group_info'),
    Markup.button.callback(
      'Info about my individual lessons',
      'individual_info',
    ),
    Markup.button.callback('Put off lesson', 'put_off_lesson'),
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
