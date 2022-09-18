import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Individual } from './individual.entity';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { UpdateGroupDto } from '../group/dto/update-group.dto';

@Injectable()
export class IndividualService {
  constructor(
    @Inject('INDIVIDUAL_REPOSITORY')
    private individualRepository: Repository<Individual>,
  ) {}

  async getAll() {
    return this.individualRepository.find();
  }

  async getOneById(id: number) {
    return this.individualRepository.findOne({
      where: { id },
      relations: ['student', 'teacher', 'daysAndTimes'],
    });
  }

  async create(createGroupDto: CreateGroupDto) {
    return this.individualRepository.save(createGroupDto);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.individualRepository.update({ id }, updateGroupDto);
  }

  async delete(id: number) {
    return this.individualRepository.delete({ id });
  }
}
