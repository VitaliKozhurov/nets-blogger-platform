import { LikeStatus } from '../../types/likes/like-status.types';
import { CommentDocument } from '../../domain/comments/comment.types';

export class CommentResponseDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };

  static mapToView(commentDocument: CommentDocument, myStatus: LikeStatus): CommentResponseDto {
    const dto = new CommentResponseDto();

    dto.id = commentDocument._id.toString();
    dto.content = commentDocument.content;
    dto.commentatorInfo.userId = commentDocument.commentatorInfo.userId;
    dto.commentatorInfo.userLogin = commentDocument.commentatorInfo.userLogin;
    dto.createdAt = commentDocument.createdAt.toISOString();
    dto.likesInfo.likesCount = commentDocument.likesInfo.likesCount;
    dto.likesInfo.dislikesCount = commentDocument.likesInfo.dislikesCount;
    dto.likesInfo.myStatus = myStatus;

    return dto;
  }
}
