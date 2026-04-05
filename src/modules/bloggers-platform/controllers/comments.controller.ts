import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../repository/comments/comments-query.repository';
import { ObjectIdValidationPipe } from 'src/core/pipes';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get(':id')
  async getById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.commentsQueryRepository.findByIdOrThrow({ commentId: id });
  }
}
