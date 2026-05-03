import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';

export interface IDeleteCommentDto extends RequestUserDto {
  id: string;
}
