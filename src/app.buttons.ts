import { Markup } from 'telegraf';
import { LearningDays, LearningTimeIntervals } from './enums/daysAndTime';
import { SkillLevel } from './enums/skillLevel.enum';
import { TypeOfLessons } from './enums/typeOfLessons.enum';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('Info about my group', 'group_info'),
      Markup.button.callback(
        'Info about my individual lessons',
        'individual_info',
      ),
      // Markup.button.callback('Put off lesson', 'put_off_lesson'),
      Markup.button.callback('Individual lesson', 'individual_lesson'),
      Markup.button.callback('Group lesson', 'group_lesson'),
      // Markup.button.callback('Choose Day', 'choose_day'),
      // Markup.button.callback('Choose Time', 'choose_time'),
      // Markup.button.callback('Cancel lesson', 'cancel_lesson'),
      Markup.button.callback('Get lesson prices', 'lesson_prices'),
      Markup.button.callback('Get groups info', 'groups_info'),
      Markup.button.callback('Notify about absence', 'absent_notify'),
      Markup.button.callback('Restart', 'restart'),
    ],
    { columns: 3 },
  );
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

export function daysButtons() {
  return Markup.keyboard([
    Object.values(LearningDays).map((value) =>
      Markup.button.callback(value, value),
    ),
  ]);
}

export function timeButtons() {
  return Markup.keyboard([
    Object.values(LearningTimeIntervals).map((value) =>
      Markup.button.callback(value, value),
    ),
  ]);
}
