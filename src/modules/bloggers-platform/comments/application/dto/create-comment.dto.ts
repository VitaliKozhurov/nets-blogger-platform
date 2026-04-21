import { RequestUserDto } from 'src/modules/users-account/contracts';

export interface ICreateCommentDto extends RequestUserDto {
  id: string;
  content: string;
}
