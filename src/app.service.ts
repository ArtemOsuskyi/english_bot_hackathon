import { Injectable } from '@nestjs/common';
import { TypeOfLessons } from './enums/lessonTypes';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
