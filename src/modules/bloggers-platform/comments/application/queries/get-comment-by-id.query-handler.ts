import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../repository';
import { CommentViewMapper, ICommentViewDto } from '../dto/comment.mapper';

export class GetCommentByIdQuery extends Query<ICommentViewDto> {
  constructor(public dto: { commentId: string; userId?: string }) {
    super();
  }
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute({ dto }: GetCommentByIdQuery) {
    const comment = await this.commentsQueryRepository.findByIdOrThrow(dto);

    return CommentViewMapper.mapToView(comment);
  }
}
