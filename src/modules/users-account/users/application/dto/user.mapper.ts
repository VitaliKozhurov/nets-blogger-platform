import { IUserEntityDto } from '../../domain/dto';

export class UserViewMapper {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(user: IUserEntityDto): UserViewMapper {
    const dto = new UserViewMapper();

    dto.id = user.id;
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
}

export interface IUserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}
