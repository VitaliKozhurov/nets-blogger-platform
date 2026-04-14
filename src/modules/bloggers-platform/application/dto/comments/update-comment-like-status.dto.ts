import { LikeStatus } from '../../../domain/likes';
import { RequestUserDto } from 'src/modules/users-account/contracts';

export interface IUpdateCommentLikeStatusDto extends RequestUserDto {
  id: string;
  likeStatus: LikeStatus;
}
