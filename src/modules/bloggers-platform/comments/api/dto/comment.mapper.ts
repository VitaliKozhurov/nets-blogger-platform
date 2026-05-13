import { LikeStatus } from '@modules/bloggers-platform/likes/domain';
import { ICommentRepositoryDto } from '../../repository';

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

  static mapToView(comment: ICommentRepositoryDto): CommentResponseMapperDto {
    const dto = new CommentResponseMapperDto();

    dto.id = comment.id;
    dto.content = comment.content;
    dto.createdAt = comment.createdAt.toISOString();
    const commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };

    dto.commentatorInfo = commentatorInfo;


    const likesInfo = {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: comment.myStatus,
    };

    dto.likesInfo = likesInfo;

    return dto;
  }
}
