import { LikeStatus } from '@modules/bloggers-platform/likes/domain/dto';
import { ICommentEntityDto } from '../../domain/dto';

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

  static mapToView(
    comment: ICommentEntityDto & {
      likesCount: number;
      dislikesCount: number;
      myStatus: LikeStatus;
      userLogin: string;
    }
  ): CommentViewMapper {
    const dto = new CommentViewMapper();

    const commentatorInfo = {
      userId: comment.ownerId,
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
