import { RequestUserDto } from 'src/modules/users-account/auth';

export interface IDeleteCommentDto extends RequestUserDto {
  id: string;
}
