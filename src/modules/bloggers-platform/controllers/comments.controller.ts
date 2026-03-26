import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../repository/comments/comments-query.repository';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.commentsQueryRepository.findByIdOrThrow({ commentId: id });
  }
}
