import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { IBlogViewDto } from '../../api/dto/blog-view.dto';
import { BlogsQueryRepository } from '../../repository';

export class GetBlogByIdQuery extends Query<IBlogViewDto> {
  constructor(public blogId: string) {
    super();
  }
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdHandler implements IQueryHandler<GetBlogByIdQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ blogId }: GetBlogByIdQuery) {
    const result = await this.blogsQueryRepository.findByIdOrThrow(blogId);

    return result;
  }
}
