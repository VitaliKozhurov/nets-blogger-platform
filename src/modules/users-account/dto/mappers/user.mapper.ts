import { UserDocument } from '../../domain/users/user.types';
import { IUserResponseDto } from '../contracts/user.dto';

export class UserResponseMapperDto implements IUserResponseDto {
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
