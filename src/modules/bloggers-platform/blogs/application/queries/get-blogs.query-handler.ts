import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { IBlogViewDto } from '../../api/dto/blog-view.dto';
import { IGetBlogsQueryDto } from '../../api';
import { BlogsQueryRepository } from '../../repository';

export class GetBlogsQuery extends Query<PaginationResponseMapperDto<IBlogViewDto[]>> {
  constructor(public dto: IGetBlogsQueryDto) {
    super();
  }
}

@QueryHandler(GetBlogsQuery)
export class GetBlogsHandler implements IQueryHandler<GetBlogsQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ dto }: GetBlogsQuery) {
    const result = await this.blogsQueryRepository.findAll(dto);

    return result;
  }
}
