import { RequestUserDto } from 'src/modules/users-account/contracts';

export interface IUpdateCommentContentDto extends RequestUserDto {
  id: string;
  content: string;
}
