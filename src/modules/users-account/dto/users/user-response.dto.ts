import { UserDocument } from '../../domain/users/user.types';

export class UserResponseDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(userDocument: UserDocument): UserResponseDto {
    const dto = new UserResponseDto();

    dto.id = userDocument._id.toString();
    dto.login = userDocument.login;
    dto.email = userDocument.email;
    dto.createdAt = userDocument.createdAt.toISOString();

    return dto;
  }
}
