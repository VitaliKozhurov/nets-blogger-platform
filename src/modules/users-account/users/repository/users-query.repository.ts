import { Injectable } from '@nestjs/common';

import { UserResponseMapperDto } from '../api/dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUserDbDto } from './dto/user-db.dto';
import { getPaginationParams } from 'src/core/utils';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { IGetUsersQueryDto } from '../application';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAll(query: IGetUsersQueryDto) {
    const { searchEmailTerm, searchLoginTerm, sortBy, sortDirection } = query;
    const sortColumn = `"${sortBy}"`;
    const { skip, limit } = getPaginationParams(query);

    const usersPromise: Promise<IUserDbDto[]> = this.dataSource.query(
      `
      SELECT *
        FROM users
        WHERE (email ILIKE $1 OR login ILIKE $2) AND "deletedAt" IS NULL
        ORDER BY ${sortColumn} ${sortDirection}
        LIMIT $3
        OFFSET $4
      `,
      [`%${searchEmailTerm ?? ''}%`, `%${searchLoginTerm ?? ''}%`, limit, skip]
    );

    const totalCountPromise: Promise<[{ count: string }]> = this.dataSource.query(
      `
      SELECT COUNT(*) AS count
        FROM users
        WHERE (email ILIKE $1 OR login ILIKE $2) AND "deletedAt" IS NULL
      `,
      [`%${searchEmailTerm ?? ''}%`, `%${searchLoginTerm ?? ''}%`]
    );

    const [usersResult, countResult] = await Promise.all([usersPromise, totalCountPromise]);

    return PaginationResponseMapperDto.mapToViewModel({
      items: usersResult.map(UserResponseMapperDto.mapToView),
      totalCount: Number(countResult[0].count),
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
