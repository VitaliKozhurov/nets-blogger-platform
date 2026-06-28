import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../../repository';
import { CommentViewMapper } from '../dto/comment.mapper';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';
import { ICreateCommentDto } from '../dto';
import { CommentEntity } from '../../domain/comment.entity';

@Injectable()
export class CommentsFactory {
  constructor(private commentsRepository: CommentsRepository) {}

  async createComment(dto: ICreateCommentDto) {
    const newComment = CommentEntity.createComment(dto);
    const savedComment = await this.commentsRepository.save(newComment);

    return CommentViewMapper.mapToView({
      id: savedComment.id,
      userId: savedComment.authorId,
      content: savedComment.content,
      createdAt: savedComment.createdAt,
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.None,
      userLogin: dto.login,
    });
  }
}
