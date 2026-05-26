import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../repository';
import { IPaginationResponseDto, PaginationViewMapper } from 'src/core/dto/';
import { getPaginationParams } from 'src/core/utils';
import { IGetBlogsParamsDto } from '../../repository/dto/get-blogs.params.dto';
import { BlogViewMapper, IBlogViewDto } from '../dto/blog.mapper';
import { IGetBlogsQueryDto } from '../dto';

export class GetBlogsQuery extends Query<IPaginationResponseDto<IBlogViewDto[]>> {
  constructor(public dto: IGetBlogsQueryDto) {
    super();
  }
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsHandler implements IQueryHandler<GetBlogsQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ dto }: GetBlogsQuery) {
    const { offset, limit } = getPaginationParams({
      pageNumber: dto.pageNumber,
      pageSize: dto.pageSize,
    });

    const params: IGetBlogsParamsDto = {
      searchNameTerm: dto.searchNameTerm,
      sortBy: dto.sortBy,
      sortDirection: dto.sortDirection,
      limit,
      offset,
    };

    const { blogs, totalCount } = await this.blogsQueryRepository.findAll(params);

    const result = PaginationViewMapper.mapToViewModel({
      items: blogs.map(BlogViewMapper.mapToView),
      totalCount,
      page: dto.pageNumber,
      size: dto.pageSize,
    });

    return result;
  }
}
