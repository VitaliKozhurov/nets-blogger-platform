import { LikeStatus } from '@modules/bloggers-platform/likes/domain';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';

export interface IUpdatePostLikeStatusDto extends RequestUserDto {
  id: string;
  likeStatus: LikeStatus;
}
