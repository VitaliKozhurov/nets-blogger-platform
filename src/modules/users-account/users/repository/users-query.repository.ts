import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, ILike, Repository } from 'typeorm';
import { UserEntity } from '../domain/user.entity';
import { IGetUsersParamsDto } from './dto/get-users.params.dto';
import { IUserQueryDto } from './dto/user-query.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>) {}

  async findAll(query: IGetUsersParamsDto): Promise<{
    items: IUserQueryDto[];
    totalCount: number;
  }> {
    const { searchEmailTerm, searchLoginTerm, sortBy, sortDirection, limit, offset } = query;

    const orWhereConditions: Record<string, FindOperator<string>>[] = [];

    if (searchLoginTerm) {
      orWhereConditions.push({ login: ILike(`%${searchLoginTerm}%`) });
    }

    if (searchEmailTerm) {
      orWhereConditions.push({ email: ILike(`%${searchEmailTerm}%`) });
    }

    const where = orWhereConditions.length > 0 ? orWhereConditions : undefined;

    const result = await this.usersRepo.findAndCount({
      select: {
        id: true,
        login: true,
        email: true,
        createdAt: true,
      },
      where,
      withDeleted: false,
      order: { [sortBy]: sortDirection },
      skip: offset,
      take: limit,
    });

    return { items: result[0], totalCount: result[1] };
  }
}
