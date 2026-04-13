import { RequestUserDto } from '../../../../users-account/application/dto/request-user.dto';

export interface IDeleteCommentDto extends RequestUserDto {
  id: string;
}
