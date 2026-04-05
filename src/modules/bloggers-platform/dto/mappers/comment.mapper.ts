import { CommentDocument } from '../../domain/comments/comment.types';
import { ICommentResponseDto } from '../contracts/comment.dto';
import { LikeStatus } from '../contracts/like.dto';

export class CommentResponseMapperDto implements ICommentResponseDto {
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
  static mapToView(commentDocument: CommentDocument, myStatus: LikeStatus): ICommentResponseDto {
    const dto = new CommentResponseMapperDto();

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
