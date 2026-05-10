import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { IPostViewDto } from '../../api';
import { PostsQueryRepository } from '../../repository';

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
    const result = await this.postsQueryRepository.findByIdOrThrow(dto);

    return result;
  }
}
