import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { QueryFilter } from 'mongoose';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { getPaginationParams } from 'src/core/utils';
import { User } from '../domain';
import { UserDocument, type UserModelType } from '../domain';
import { UserResponseMapperDto } from '../api/dto';
import { IGetUsersQueryParamsDto } from '../api/dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDbDto } from './user-db.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectDataSource() protected dataSource: DataSource
  ) {}

  async findAll(
    query: IGetUsersQueryParamsDto
  ): Promise<PaginationResponseMapperDto<UserResponseMapperDto[]>> {
    const filter: QueryFilter<UserDocument> = {
      deletedAt: null,
    };

    if (query.searchLoginTerm) {
      filter.$or = filter.$or ?? [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }

    if (query.searchEmailTerm) {
      filter.$or = filter.$or ?? [];
      filter.$or.push({
        email: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }

    const { sort, skip, limit } = getPaginationParams(query);

    const usersPromise = this.UserModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalCountPromise = this.UserModel.countDocuments(filter).exec();

    const [items, totalCount] = await Promise.all([usersPromise, totalCountPromise]);

    return PaginationResponseMapperDto.mapToViewModel({
      items: items.map(UserResponseMapperDto.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findAllPG() {
    const result: UserDbDto[] = await this.dataSource.query(`
      SELECT *
        FROM "users"
      `);

    return result;
  }

  async findByIdOrThrow(id: string): Promise<UserResponseMapperDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'User not found',
      });
    }

    return UserResponseMapperDto.mapToView(user);
  }
}
