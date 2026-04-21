import { UserDocument } from '../../domain';

export class UserResponseMapperDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;

  static mapToView(userDocument: UserDocument): UserResponseMapperDto {
    const dto = new UserResponseMapperDto();

    dto.id = userDocument._id.toString();
    dto.login = userDocument.login;
    dto.email = userDocument.email;
    dto.createdAt = userDocument.createdAt.toISOString();

    return dto;
  }
}
