import { LikeStatus } from 'src/modules/bloggers-platform/domain/likes/like.dto';
import { RequestUserDto } from 'src/modules/users-account/application/dto/request-user.dto';

export interface IUpdatePostLikeStatusDto extends RequestUserDto {
  id: string;
  likeStatus: LikeStatus;
}
