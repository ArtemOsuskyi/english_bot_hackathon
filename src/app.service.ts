import { Injectable } from '@nestjs/common';
import { TypeOfLessons } from './enums/lessonTypes';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  chooseLessonType(type: TypeOfLessons) {
    return 'Lesson type '; //boolean to know if result is successfull
  }

  getLessonPrice(lessonType: TypeOfLessons) {
    return '';
  }

  getAllPrices() {
    const prices = { GROUP: '120', SOLO: '500' };
    return prices;
  }
}
