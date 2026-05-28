import { LikeStatus } from '../../../likes/domain/dto';
import { IPostEntityDto } from '../../domain/dto';

export interface IPostWithDetails extends Omit<IPostEntityDto, 'deletedAt'> {
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
