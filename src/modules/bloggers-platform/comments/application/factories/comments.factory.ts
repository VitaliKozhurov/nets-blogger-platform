import { ICreateCommentDto } from '@modules/bloggers-platform/comments/application/dto';
import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../../repository';

@Injectable()
export class CommentsFactory {
  constructor(private commentsRepository: CommentsRepository) {}

  async createComment(dto: ICreateCommentDto) {
    const newComment = this.commentsRepository.create(dto);

    return newComment;
  }
}
