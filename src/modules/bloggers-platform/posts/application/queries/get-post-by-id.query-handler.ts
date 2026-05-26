import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../repository';
import { IPostViewDto, PostViewMapper } from '../dto';

interface GetPostByIdDto {
  postId: string;
  userId?: string;
}

export class GetPostByIdQuery extends Query<IPostViewDto> {
  constructor(public dto: GetPostByIdDto) {
    super();
  }
}

@QueryHandler(GetPostByIdQuery)
export class GetPostsByIdHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute({ dto }: GetPostByIdQuery) {
    const { post, newestLikes } = await this.postsQueryRepository.findByIdOrThrow(dto);

    return PostViewMapper.mapToView({ post, newestLikes });
  }
}
