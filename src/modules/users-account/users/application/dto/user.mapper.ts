import { UserEntity } from '../../domain/user.entity';

export interface IUserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

type InputUserType = Pick<UserEntity, 'id' | 'login' | 'email' | 'createdAt'>;

export class UserViewMapper {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(user: InputUserType): UserViewMapper {
    const dto = new UserViewMapper();

    dto.id = user.id;
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
}
