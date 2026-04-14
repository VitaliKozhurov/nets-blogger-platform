import { RequestUserDto } from '../../../../users-account/application/dto/request-user.dto';

export interface ICreateCommentDto extends RequestUserDto {
  id: string;
  content: string;
}
