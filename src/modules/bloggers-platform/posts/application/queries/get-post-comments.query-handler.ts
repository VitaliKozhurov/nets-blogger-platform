import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginationViewMapper } from 'src/core/dto';
import {
  CommentsQueryRepository,
  IGetCommentsByPostIdQueryDto,
} from 'src/modules/bloggers-platform/comments';
import { PostsRepository } from '../../repository';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { CommentViewMapper } from 'src/modules/bloggers-platform/comments/application/dto/comment.mapper';
import { getPaginationParams } from 'src/core/utils';
import { IGetCommentsByPostParamsDto } from 'src/modules/bloggers-platform/comments/repository/dto/get-comments-by-post.dto';

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
    const { postId, query, userId } = dto;

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    const { offset, limit } = getPaginationParams({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    });

    const params: IGetCommentsByPostParamsDto = {
      postId,
      userId,
      query: {
        limit,
        offset,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
      },
    };

    const commentsData = await this.commentsQueryRepository.getAllByPostId(params);

    const items = commentsData.comments.map(item => CommentViewMapper.mapToView(item));

    return PaginationViewMapper.mapToViewModel({
      items,
      totalCount: commentsData.totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
