import { RequestUserDto } from 'src/modules/users-account/application/dto/request-user.dto';
import { LikeStatus } from '../../../dto/contracts/like.dto';

export interface IUpdateCommentLikeStatusDto extends RequestUserDto {
  id: string;
  likeStatus: LikeStatus;
}
