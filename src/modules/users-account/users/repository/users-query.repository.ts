import { Injectable } from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUserEntityDto } from '../domain/dto';
import { IGetUsersParamsDto } from './dto/get-users.params.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAll(query: IGetUsersParamsDto): Promise<{
    users: IUserEntityDto[];
    totalCount: number;
  }> {
    const { searchEmailTerm, searchLoginTerm, sortBy, sortDirection, limit, offset } = query;

    const usersPromise: Promise<IUserEntityDto[]> = this.dataSource.query(
      `
      SELECT *
        FROM users
        WHERE (email ILIKE $1 OR login ILIKE $2) AND "deletedAt" IS NULL
        ORDER BY ${`"${sortBy}"`} ${sortDirection}
        LIMIT $3
        OFFSET $4
      `,
      [`%${searchEmailTerm ?? ''}%`, `%${searchLoginTerm ?? ''}%`, limit, offset]
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

    return { users: usersResult, totalCount: Number(countResult[0].count) };
  }
}
