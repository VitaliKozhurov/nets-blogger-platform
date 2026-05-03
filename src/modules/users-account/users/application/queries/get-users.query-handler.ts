import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../repository/users-query.repository';
import type { IGetUsersQueryDto } from '../dto/get-users-query.dto';
import { PaginationResponseMapperDto } from 'src/core/dto';
import type { IUserViewDto } from '../../api/dto/user-view.dto';

export class GetUsersQuery extends Query<PaginationResponseMapperDto<IUserViewDto[]>> {
  constructor(public dto: IGetUsersQueryDto) {
    super();
  }
}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({ dto }: GetUsersQuery) {
    const result = await this.usersQueryRepository.findAll(dto);

    return result;
  }
}
