import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';

export interface ICreateCommentDto extends RequestUserDto {
  id: string;
  content: string;
}
