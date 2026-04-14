import { RequestUserDto } from 'src/modules/users-account/contracts';

export interface IDeleteCommentDto extends RequestUserDto {
  id: string;
}
