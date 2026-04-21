import { LikeStatus } from '@modules/bloggers-platform/likes/domain';
import { RequestUserDto } from 'src/modules/users-account/contracts';

export interface IUpdatePostLikeStatusDto extends RequestUserDto {
  id: string;
  likeStatus: LikeStatus;
}
