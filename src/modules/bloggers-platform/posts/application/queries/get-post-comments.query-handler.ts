import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginationResponseMapperDto } from 'src/core/dto';
import {
  CommentsQueryRepository,
  IGetCommentsByPostIdQueryDto,
} from 'src/modules/bloggers-platform/comments';
import { CommentResponseMapperDto } from 'src/modules/bloggers-platform/comments/api/dto/comment.mapper';

interface GetPostCommentsDto {
  postId: string;
  userId?: string;
  query: IGetCommentsByPostIdQueryDto;
}

export class GetPostCommentsQuery extends Query<
  PaginationResponseMapperDto<CommentResponseMapperDto[]>
> {
  constructor(public dto: GetPostCommentsDto) {
    super();
  }
}

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsHandler implements IQueryHandler<GetPostCommentsQuery> {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  async execute({ dto }: GetPostCommentsQuery) {
    const result = await this.commentsQueryRepository.getAllByPostId(dto);

    return result;
  }
}
