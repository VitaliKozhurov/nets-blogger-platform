import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginationViewMapper } from 'src/core/dto';
import {
  CommentsQueryRepository,
  IGetCommentsByPostIdQueryDto,
} from 'src/modules/bloggers-platform/comments';
import { PostsRepository } from '../../repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { CommentViewMapper } from 'src/modules/bloggers-platform/comments/application/dto/comment.mapper';

interface GetPostCommentsDto {
  postId: string;
  userId?: string;
  query: IGetCommentsByPostIdQueryDto;
}

export class GetPostCommentsQuery extends Query<PaginationViewMapper<CommentViewMapper[]>> {
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
