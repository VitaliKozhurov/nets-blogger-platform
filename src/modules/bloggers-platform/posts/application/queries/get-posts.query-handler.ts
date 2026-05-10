import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { IGetPostsQueryDto, IPostViewDto } from '../../api';
import { PostsQueryRepository } from '../../repository';
import { IPaginationResponseDto } from 'src/core/dto/';

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
    const result = await this.postsQueryRepository.findAll(dto);

    return result;
  }
}
