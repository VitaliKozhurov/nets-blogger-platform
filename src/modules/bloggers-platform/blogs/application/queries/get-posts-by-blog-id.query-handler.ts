import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../repository';
import { IPaginationResponseDto, PaginationViewMapper } from 'src/core/dto';
import {
  IGetPostsQueryDto,
  IPostViewDto,
  PostsQueryRepository,
} from 'src/modules/bloggers-platform/posts';
import { getPaginationParams } from 'src/core/utils';
import { IGetPostsParamsDto } from 'src/modules/bloggers-platform/posts/repository/dto/get-posts.params.dto';
import { PostViewMapper } from 'src/modules/bloggers-platform/posts/application';

interface PostsDto {
  blogId: string;
  query: IGetPostsQueryDto;
  userId?: string;
}

export class GetPostsByBlogIdQuery extends Query<IPaginationResponseDto<IPostViewDto[]>> {
  constructor(public dto: PostsDto) {
    super();
  }
}

@QueryHandler(GetPostsByBlogIdQuery)
export class GetPostsByBlogIdHandler implements IQueryHandler<GetPostsByBlogIdQuery> {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository
  ) {}

  async execute({ dto }: GetPostsByBlogIdQuery) {
    const { blogId, query, userId } = dto;

    const { offset, limit } = getPaginationParams({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    });

    await this.blogsQueryRepository.findByIdOrThrow(blogId);

    const params: IGetPostsParamsDto = {
      blogId,
      userId,
      query: {
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        limit,
        offset,
      },
    };

    const { posts, totalCount } = await this.postsQueryRepository.findAllForBlogId(params);

    const result = PaginationViewMapper.mapToViewModel({
      items: posts.map(PostViewMapper.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });

    return result;
  }
}
