import { LikeStatus } from '@modules/bloggers-platform/likes/domain/dto';
import { ICommentsWithDetailsDto } from '../../repository/dto/comment-with-details.dto';

export class CommentViewMapper {
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };

  static mapToView(comment: ICommentsWithDetailsDto): CommentViewMapper {
    const dto = new CommentViewMapper();

    const commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    const likesInfo = {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: comment.myStatus,
    };

    dto.id = comment.id;
    dto.content = comment.content;
    dto.createdAt = comment.createdAt.toISOString();
    dto.commentatorInfo = commentatorInfo;
    dto.likesInfo = likesInfo;

    return dto;
  }
}

export interface ICommentViewDto {
  id: string;
  content: string;
  createdAt: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
}
