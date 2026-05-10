import { Injectable } from '@nestjs/common';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { getPaginationParams } from 'src/core/utils';
import { BlogResponseMapperDto } from '../api/dto/blog.mapper';
import { IGetBlogsQueryParamsDto } from '../api/dto/get-blogs-query.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IBlogRepository } from './dto/IBlogRepositoryDto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAll(
    query: IGetBlogsQueryParamsDto
  ): Promise<PaginationResponseMapperDto<BlogResponseMapperDto[]>> {
    const { searchNameTerm, sortBy, sortDirection } = query;

    const sortColumn = `"${sortBy}"`;

    const { skip, limit } = getPaginationParams(query);

    const blogsPromise: Promise<IBlogRepository[]> = this.dataSource.query(
      `
      SELECT *
        FROM blogs
        WHERE (name ILIKE $1) AND "deletedAt" IS NULL
        ORDER BY ${sortColumn} ${sortDirection}
        LIMIT $3
        OFFSET $4
      `,
      [`%${searchNameTerm ?? ''}%`, limit, skip]
    );

    const totalCountPromise = this.dataSource.query(
      `
      SELECT COUNT(*)
        FROM blogs
        WHERE (name ILIKE $1) AND "deletedAt" IS NULL
      `,
      [`%${searchNameTerm ?? ''}%`]
    );

    const [items, totalCount] = await Promise.all([blogsPromise, totalCountPromise]);

    return PaginationResponseMapperDto.mapToViewModel({
      items: items.map(BlogResponseMapperDto.mapToView),
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findByIdOrThrow(id: string): Promise<BlogResponseMapperDto> {
    const [blog]: IBlogRepository[] = await this.dataSource.query(
      `
      SELECT *
        FROM blogs
        WHERE id=$1 AND "deletedAt" IS NULL
      `,
      [id]
    );

    if (!blog) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Blog not found',
      });
    }

    return BlogResponseMapperDto.mapToView(blog);
  }
}
