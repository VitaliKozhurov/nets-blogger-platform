import { Injectable } from '@nestjs/common';
import { PaginationViewMapper } from 'src/core/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { getPaginationParams } from 'src/core/utils';
import { BlogResponseMapperDto } from '../api/dto/blog.mapper';
import { IGetBlogsQueryDto } from '../api/dto/get-blogs-query.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IBlogRepositoryDto } from './dto/blog-repository.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAll(query: IGetBlogsQueryDto): Promise<PaginationViewMapper<BlogResponseMapperDto[]>> {
    const { searchNameTerm, sortBy, sortDirection } = query;

    const sortColumn = `"${sortBy}"`;

    const { offset, limit } = getPaginationParams(query);

    const blogsPromise: Promise<IBlogRepositoryDto[]> = this.dataSource.query(
      `
      SELECT *
        FROM blogs
        WHERE (name ILIKE $1) AND "deletedAt" IS NULL
        ORDER BY ${sortColumn} ${sortDirection}
        LIMIT $2
        OFFSET $3
      `,
      [`%${searchNameTerm ?? ''}%`, limit, offset]
    );

    const totalCountPromise: Promise<[{ count: string }]> = this.dataSource.query(
      `
      SELECT COUNT(*)
        FROM blogs
        WHERE (name ILIKE $1) AND "deletedAt" IS NULL
      `,
      [`%${searchNameTerm ?? ''}%`]
    );

    const [items, countResult] = await Promise.all([blogsPromise, totalCountPromise]);

    return PaginationViewMapper.mapToViewModel({
      items: items.map(BlogResponseMapperDto.mapToView),
      totalCount: Number(countResult[0].count),
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findByIdOrThrow(id: string): Promise<BlogResponseMapperDto> {
    const [blog]: IBlogRepositoryDto[] = await this.dataSource.query(
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
