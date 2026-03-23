import { UserDocument } from '../domain/user.schema';

export class UserResponseDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(userDocument: UserDocument): UserResponseDto {
    const dto = new UserResponseDto();

    dto.id = userDocument.id;
    dto.login = userDocument.login;
    dto.email = userDocument.email;
    dto.createdAt = userDocument.createdAt.toISOString();

    return dto;
  }
}
