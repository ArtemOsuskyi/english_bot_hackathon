import { Injectable } from '@nestjs/common';
import { LessonTypes } from './enums/lessonTypes';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  chooseLessonType(type: LessonTypes) {
    return 'Lesson type ';
  }
}
