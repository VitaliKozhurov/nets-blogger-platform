import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../repository';
import { IPaginationResponseDto } from 'src/core/dto';
import {
  IGetPostsQueryDto,
  IPostViewDto,
  PostsQueryRepository,
} from 'src/modules/bloggers-platform/posts';

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

    await this.blogsQueryRepository.findByIdOrThrow(blogId);

    return this.postsQueryRepository.findAllForBlogId({
      blogId,
      query,
      userId,
    });
  }
}
