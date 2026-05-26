import { ICreateCommentDto } from '@modules/bloggers-platform/comments/application/dto';
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../../repository';
import { CommentViewMapper } from '../dto/comment.mapper';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';

@Injectable()
export class CommentsFactory {
  constructor(private commentsRepository: CommentsRepository) {}

  async createComment(dto: ICreateCommentDto) {
    const newComment = await this.commentsRepository.create(dto);

    return CommentViewMapper.mapToView({
      ...newComment,
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
      userLogin: dto.login,
    });
  }
}
