import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../repository';
import { BlogViewMapper, IBlogViewDto } from '../dto/blog.mapper';

export class GetBlogByIdQuery extends Query<IBlogViewDto> {
  constructor(public blogId: string) {
    super();
  }
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdHandler implements IQueryHandler<GetBlogByIdQuery> {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute({ blogId }: GetBlogByIdQuery) {
    const blog = await this.blogsQueryRepository.findByIdOrThrow(blogId);

    return BlogViewMapper.mapToView(blog);
  }
}
