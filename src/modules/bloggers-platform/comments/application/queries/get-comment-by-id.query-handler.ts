import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../repository';
import { ICommentViewDto } from '../../api';

export class GetCommentByIdQuery extends Query<ICommentViewDto> {
  constructor(public dto: { commentId: string; userId?: string }) {
    super();
  }
}

@QueryHandler(GetCommentByIdQuery)
export class GetCommentByIdHandler implements IQueryHandler<GetCommentByIdQuery> {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute({ dto }: GetCommentByIdQuery) {
    const result = await this.commentsQueryRepository.findByIdOrThrow(dto);

    return result;
  }
}
