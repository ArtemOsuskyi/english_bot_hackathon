import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard([
    Markup.button.callback('List of my lessons', 'lessons_list'),
    Markup.button.callback('Skip lesson', 'skip_lesson'),
    Markup.button.callback('Put off lesson', 'put_off_lesson'),
  ]);
}
