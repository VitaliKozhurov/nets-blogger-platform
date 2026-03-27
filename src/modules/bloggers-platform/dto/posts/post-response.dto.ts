import { LikeDocument } from '../../domain/likes/like.types';
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

  static mapToView(args: {
    postDocument: PostDocument;
    myStatus: LikeStatus;
    newestLikes: LikeDocument[];
  }): PostResponseDto {
    const dto = new PostResponseDto();
    const { postDocument, myStatus, newestLikes } = args;

    dto.id = postDocument._id.toString();
    dto.title = postDocument.title;
    dto.shortDescription = postDocument.shortDescription;
    dto.content = postDocument.content;
    dto.blogId = postDocument.blogId;
    dto.blogName = postDocument.blogName;
    dto.createdAt = postDocument.createdAt.toISOString();

    dto.extendedLikesInfo = {
      likesCount: postDocument.likesInfo.likesCount,
      dislikesCount: postDocument.likesInfo.dislikesCount,
      myStatus: myStatus,
      newestLikes: newestLikes.map(like => ({
        addedAt: like.addedLikeDate?.toISOString() ?? '',
        userId: like.authorId,
        login: like.login,
      })),
    };

    return dto;
  }
}
