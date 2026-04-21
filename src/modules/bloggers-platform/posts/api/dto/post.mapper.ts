import { PostDocument } from '@modules/bloggers-platform/posts/domain';
import { LikeDocument, LikeStatus } from '@modules/bloggers-platform/likes/domain';

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

  static mapToView(args: {
    postDocument: PostDocument;
    myStatus: LikeStatus;
    newestLikes: LikeDocument[];
  }): IPostResponseDto {
    const dto = new PostResponseMapperDto();
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

export interface IPostResponseDto {
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
}
