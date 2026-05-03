import type { IUserRepositoryDto } from '../../repository/dto/user-repository.dto';

export class UserResponseMapperDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(user: IUserRepositoryDto): UserResponseMapperDto {
    const dto = new UserResponseMapperDto();

    dto.id = user.id;
    dto.login = user.login;
    dto.email = user.email;
    dto.createdAt = user.createdAt.toISOString();

    return dto;
  }
}
