import { RequestUserDto } from 'src/modules/users-account/auth';

export interface IUpdateCommentContentDto extends RequestUserDto {
  id: string;
  content: string;
}
