import { RequestUserDto } from 'src/modules/users-account/auth';

export interface ICreateCommentDto extends RequestUserDto {
  id: string;
  content: string;
}
