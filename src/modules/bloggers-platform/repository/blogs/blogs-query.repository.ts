import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter } from 'mongoose';

import { PaginationResponseMapperDto } from 'src/core/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { getPaginationParams } from 'src/core/utils';
import { Blog } from '../../domain/blogs/blog.schema';
import { BlogDocument, type BlogModelType } from '../../domain/blogs/blog.types';
import { BlogResponseMapperDto } from '../../api/dto/blogs/blog.mapper';
import { IGetBlogsQueryParamsDto } from '../../api/dto/blogs/get-blogs-query.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType
  ) {}

  async findAll(
    query: IGetBlogsQueryParamsDto
  ): Promise<PaginationResponseMapperDto<BlogResponseMapperDto[]>> {
    const filter: QueryFilter<BlogDocument> = {
      deletedAt: null,
    };

    if (query.searchNameTerm) {
      filter.$or = [{ name: { $regex: query.searchNameTerm, $options: 'i' } }];
    }

    const { sort, skip, limit } = getPaginationParams(query);

    const blogsPromise = this.BlogModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalCountPromise = this.BlogModel.countDocuments(filter).exec();

    const [items, totalCount] = await Promise.all([blogsPromise, totalCountPromise]);

    return PaginationResponseMapperDto.mapToViewModel({
      items: items.map(BlogResponseMapperDto.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findByIdOrThrow(id: string): Promise<BlogResponseMapperDto> {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Blog not found',
      });
    }

    return BlogResponseMapperDto.mapToView(blog);
  }
}
