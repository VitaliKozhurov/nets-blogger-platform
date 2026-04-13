import { RequestUserDto } from '../../../../users-account/application/dto/request-user.dto';

export interface IUpdateCommentContentDto extends RequestUserDto {
  id: string;
  content: string;
}
