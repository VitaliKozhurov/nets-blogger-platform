import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../repository';
import { IGetUsersQueryDto } from '../dto';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { UserResponseMapperDto } from '../../api';

export class GetUsersQuery extends Query<PaginationResponseMapperDto<UserResponseMapperDto[]>> {
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
