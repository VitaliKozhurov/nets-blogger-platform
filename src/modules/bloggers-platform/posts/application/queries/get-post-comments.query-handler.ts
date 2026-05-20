import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginationViewMapper } from 'src/core/dto';
import {
  CommentsQueryRepository,
  IGetCommentsByPostIdQueryDto,
} from 'src/modules/bloggers-platform/comments';
import { CommentResponseMapperDto } from 'src/modules/bloggers-platform/comments/api/dto/comment.mapper';
import { PostsRepository } from '../../repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

interface GetPostCommentsDto {
  postId: string;
  userId?: string;
  query: IGetCommentsByPostIdQueryDto;
}

export class GetPostCommentsQuery extends Query<
  PaginationViewMapper<CommentResponseMapperDto[]>
> {
  constructor(public dto: GetPostCommentsDto) {
    super();
  }
}

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsHandler implements IQueryHandler<GetPostCommentsQuery> {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private postsRepository: PostsRepository
  ) {}

  async execute({ dto }: GetPostCommentsQuery) {
    const post = await this.postsRepository.findById(dto.postId);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    const result = await this.commentsQueryRepository.getAllByPostId(dto);

    return result;
  }
}
