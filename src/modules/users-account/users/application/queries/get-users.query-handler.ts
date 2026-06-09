import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../repository/users-query.repository';
import { IPaginationResponseDto, PaginationViewMapper } from 'src/core/dto';
import { IGetUsersQueryDto, IUserViewDto, UserViewMapper } from '../dto';

import { getPaginationParams } from 'src/core/utils';
import { IGetUsersParamsDto } from '../../repository/dto/get-users.params.dto';

export class GetUsersQuery extends Query<IPaginationResponseDto<IUserViewDto[]>> {
  constructor(public dto: IGetUsersQueryDto) {
    super();
  }
}

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute({ dto }: GetUsersQuery) {
    const { offset, limit } = getPaginationParams({
      pageNumber: dto.pageNumber,
      pageSize: dto.pageSize,
    });

    const params: IGetUsersParamsDto = {
      searchLoginTerm: dto.searchLoginTerm,
      searchEmailTerm: dto.searchEmailTerm,
      sortBy: dto.sortBy,
      sortDirection: dto.sortDirection,
      limit,
      offset,
    };

    const { items, totalCount } = await this.usersQueryRepository.findAll(params);

    const result = PaginationViewMapper.mapToViewModel({
      items: items.map(UserViewMapper.mapToView),
      totalCount,
      page: dto.pageNumber,
      size: dto.pageSize,
    });

    return result;
  }
}
