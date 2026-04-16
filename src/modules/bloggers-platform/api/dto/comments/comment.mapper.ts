import { CommentDocument } from '../../../domain/comments/comment.types';
import { LikeStatus } from '../../../domain/likes/like.dto';

export class CommentResponseMapperDto {
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };

  static mapToView(
    commentDocument: CommentDocument,
    myStatus: LikeStatus
  ): CommentResponseMapperDto {
    const dto = new CommentResponseMapperDto();

    dto.id = commentDocument._id.toString();
    dto.content = commentDocument.content;
    const commentatorInfo = {
      userId: commentDocument.commentatorInfo.userId,
      userLogin: commentDocument.commentatorInfo.userLogin,
    };

    dto.commentatorInfo = commentatorInfo;

    dto.createdAt = commentDocument.createdAt.toISOString();

    const likesInfo = {
      likesCount: commentDocument.likesInfo.likesCount,
      dislikesCount: commentDocument.likesInfo.dislikesCount,
      myStatus: myStatus,
    };

    dto.likesInfo = likesInfo;

    return dto;
  }
}
