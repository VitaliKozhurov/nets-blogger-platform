import { LikeStatus } from '@modules/bloggers-platform/likes/domain';
import { IPostRepository } from '../../repository';
import { INewestLike } from '../../repository/dto/newest-like.dto';
import { IPostViewDto } from './post-view.dto';

export class PostResponseMapperDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: { addedAt: string; userId: string; login: string }[];
  };

  static mapToView(args: { post: IPostRepository; newestLikes: INewestLike[] }): IPostViewDto {
    const dto = new PostResponseMapperDto();
    const { post, newestLikes } = args;

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();

    dto.extendedLikesInfo = {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus: post.myStatus,
      newestLikes: newestLikes.map(item => ({
        login: item.login,
        userId: item.userId,
        addedAt: item.addedAt.toISOString(),
      })),
    };

    return dto;
  }
}
