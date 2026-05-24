import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { IGetPostsQueryDto } from '../../api';
import { PostsQueryRepository } from '../../repository';
import { IPaginationResponseDto, PaginationViewMapper } from 'src/core/dto/';
import { IPostViewDto, PostViewMapper } from '../dto';
import { getPaginationParams } from 'src/core/utils';
import { IGetPostsParamsDto } from '../../repository/dto/get-posts.params.dto';

interface GetPostsDto {
  query: IGetPostsQueryDto;
  userId?: string;
}

export class GetPostsQuery extends Query<IPaginationResponseDto<IPostViewDto[]>> {
  constructor(public dto: GetPostsDto) {
    super();
  }
}

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute({ dto }: GetPostsQuery) {
    const { userId, query } = dto;

    const { offset, limit } = getPaginationParams({
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    });

    const params: Omit<IGetPostsParamsDto, 'blogId'> = {
      userId,
      query: {
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
        limit,
        offset,
      },
    };

    const { posts, totalCount } = await this.postsQueryRepository.findAll(params);

    const result = PaginationViewMapper.mapToViewModel({
      items: posts.map(PostViewMapper.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });

    return result;
  }
}
