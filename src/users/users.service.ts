import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  async getAll() {
    return this.userRepository.find();
  }

  async getOneByTelegramId(telegramId: number) {
    return this.userRepository.findOne({
      where: { telegramId },
      relations: ['group', 'individual'],
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async update(telegramId: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ telegramId }, updateUserDto);
  }

  async delete(telegramId: number) {
    return this.userRepository.delete({ telegramId });
  }
}
