import { Group } from '../../group/group.entity';

export class UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  phone?: string;
  groups?: Group[];
}
