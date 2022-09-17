import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Teacher } from './teachers.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @Inject('TEACHER_REPOSITORY')
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async getAll() {
    return this.teacherRepository.find();
  }

  async getOneById(id: number) {
    return this.teacherRepository.findOne({
      where: { id },
      relations: ['groups'],
    });
  }

  async create(createTeacherDto: CreateTeacherDto) {
    return this.teacherRepository.save(createTeacherDto);
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return this.teacherRepository.update({ id }, updateTeacherDto);
  }

  async delete(id: number) {
    return this.teacherRepository.delete({ id });
  }
}
