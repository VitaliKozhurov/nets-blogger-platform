import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GetUsersQueryParamsDto } from '../dto/get-users-query-params.dto';
import { QueryFilter } from 'mongoose';
import { PaginationResponseDto } from 'src/core/dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../domain/user.schema';
import type { UserModuleType } from '../domain/user.types';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModuleType
  ) {}

  async getAll(query: GetUsersQueryParamsDto) {
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

    const usersPromise = this.UserModel.find(filter)
      .sort(query.getSortOptions())
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .lean()
      .exec();

    const totalCountPromise = this.UserModel.countDocuments(filter).exec();

    const [items, totalCount] = await Promise.all([usersPromise, totalCountPromise]);

    return PaginationResponseDto.mapToViewModel({
      items: items.map(UserResponseDto.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getById(id: string) {
    const user = await this.UserModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserResponseDto.mapToView(user);
  }
}
