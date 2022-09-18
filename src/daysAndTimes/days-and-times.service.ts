import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { DaysAndTimes } from './days-and-times.entity';
import { CreateDaysAndTimesDto } from './dto/create-days-and-times.dto';
import { UpdateDaysAndTimeDto } from './dto/update-days-and-time.dto';

@Injectable()
export class DaysAndTimesService {
  constructor(
    @Inject('DAYS_AND_TIMES_REPOSITORY')
    private daysAndTimesRepository: Repository<DaysAndTimes>,
  ) {}

  async getAll() {
    return this.daysAndTimesRepository.find();
  }

  async getOneById(id: number) {
    return this.daysAndTimesRepository.findOne({
      where: { id },
      relations: ['group', 'individual'],
    });
  }

  async create(createDaysAndTimesDto: CreateDaysAndTimesDto) {
    return this.daysAndTimesRepository.save(createDaysAndTimesDto);
  }

  async update(id: number, updateDaysAndTimeDto: UpdateDaysAndTimeDto) {
    return this.daysAndTimesRepository.update({ id }, updateDaysAndTimeDto);
  }

  async delete(id: number) {
    return this.daysAndTimesRepository.delete({ id });
  }
}
