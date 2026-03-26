import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../domain/blogs/blog.schema';
import { BlogDocument, type BlogModelType } from '../../domain/blogs/blog.types';
import { GetBlogsQueryParamsDto } from '../../dto/blogs/get-blogs-query-params.dto';
import { QueryFilter } from 'mongoose';
import { PaginationResponseDto } from 'src/core/dto';
import { BlogResponseDto } from '../../dto/blogs/blog-response.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType
  ) {}

  async findAll(query: GetBlogsQueryParamsDto): Promise<PaginationResponseDto<BlogResponseDto[]>> {
    const filter: QueryFilter<BlogDocument> = {
      deletedAt: null,
    };

    if (query.searchNameTerm) {
      filter.$or = [{ login: { $regex: query.searchNameTerm, $options: 'i' } }];
    }

    const blogsPromise = this.BlogModel.find(filter)
      .sort(query.getSortOptions())
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .lean()
      .exec();

    const totalCountPromise = this.BlogModel.countDocuments(filter).exec();

    const [items, totalCount] = await Promise.all([blogsPromise, totalCountPromise]);

    return PaginationResponseDto.mapToViewModel({
      items: items.map(BlogResponseDto.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findByIdOrThrow(id: string): Promise<BlogResponseDto> {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletedAt: null,
    }).exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return BlogResponseDto.mapToView(blog);
  }
}
