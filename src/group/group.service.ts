import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @Inject('GROUP_REPOSITORY') private groupRepository: Repository<Group>,
  ) {}

  async getAll() {
    return this.groupRepository.find();
  }

  async getOneById(id: number) {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['students', 'teacher'],
    });
  }

  async create(createGroupDto: CreateGroupDto) {
    return this.groupRepository.save(createGroupDto);
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.update({ id }, updateGroupDto);
  }

  async delete(id: number) {
    return this.groupRepository.delete({ id });
  }
}
