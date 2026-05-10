import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { IBlogViewDto } from '../../api/dto/blog-view.dto';
import { IGetBlogsQueryDto } from '../../api';
import { BlogsQueryRepository } from '../../repository';
import { IPaginationResponseDto } from 'src/core/dto/';

export class GetBlogsQuery extends Query<IPaginationResponseDto<IBlogViewDto[]>> {
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
