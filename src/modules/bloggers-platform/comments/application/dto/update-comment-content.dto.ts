import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';

export interface IUpdateCommentContentDto extends RequestUserDto {
  id: string;
  content: string;
}
