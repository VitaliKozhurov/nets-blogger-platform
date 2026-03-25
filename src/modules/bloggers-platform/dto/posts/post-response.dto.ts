import { LikeStatus } from '../../types/likes/like-status.types';
import { PostDocument } from './../../domain/posts/post.types';

type NewestLike = {
  addedAt: string;
  userId: string;
  login: string;
};

export class PostResponseDto {
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
    newestLikes: NewestLike[];
  };

  static mapToView(
    postDocument: PostDocument,
    myStatus: LikeStatus,
    newestLikes: NewestLike[]
  ): PostResponseDto {
    const dto = new PostResponseDto();

    dto.id = postDocument._id.toString();
    dto.title = postDocument.title;
    dto.shortDescription = postDocument.shortDescription;
    dto.content = postDocument.content;
    dto.blogId = postDocument.blogId;
    dto.blogName = postDocument.blogName;
    dto.createdAt = postDocument.createdAt.toISOString();

    dto.extendedLikesInfo.likesCount = postDocument.likesCount;
    dto.extendedLikesInfo.dislikesCount = postDocument.dislikesCount;
    dto.extendedLikesInfo.myStatus = myStatus;
    dto.extendedLikesInfo.newestLikes = newestLikes;

    return dto;
  }
}
