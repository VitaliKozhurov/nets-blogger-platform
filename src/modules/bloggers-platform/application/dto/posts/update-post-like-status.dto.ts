import { LikeStatus } from '../../../domain/likes';
import { RequestUserDto } from 'src/modules/users-account/contracts';

export interface IUpdatePostLikeStatusDto extends RequestUserDto {
  id: string;
  likeStatus: LikeStatus;
}
