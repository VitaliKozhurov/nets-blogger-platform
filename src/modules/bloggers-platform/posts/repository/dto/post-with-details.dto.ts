import { LikeStatus } from '../../../likes/domain/dto';
import { IPostEntityDto } from '../../domain/dto';

export interface IPostWithDetails extends IPostEntityDto {
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
