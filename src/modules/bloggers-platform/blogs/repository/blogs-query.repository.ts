import { Injectable } from '@nestjs/common';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { BlogViewMapper } from '../application/dto/blog.mapper';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IBlogRepositoryDto } from './dto/blog-repository.dto';
import { IGetBlogsParamsDto } from './dto/get-blogs.params.dto';
import { IBlogEntityDto } from '../domain/dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAll(query: IGetBlogsParamsDto): Promise<{
    blogs: IBlogEntityDto[];
    totalCount: number;
  }> {
    const { searchNameTerm, sortBy, sortDirection, limit, offset } = query;

    const blogsPromise: Promise<IBlogRepositoryDto[]> = this.dataSource.query(
      `
      SELECT *
        FROM blogs
        WHERE (name ILIKE $1) AND "deletedAt" IS NULL
        ORDER BY ${`"${sortBy}"`} ${sortDirection}
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

    const [blogsResult, countResult] = await Promise.all([blogsPromise, totalCountPromise]);

    return {
      blogs: blogsResult,
      totalCount: Number(countResult[0].count),
    };
  }

  async findByIdOrThrow(id: string): Promise<BlogViewMapper> {
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

    return BlogViewMapper.mapToView(blog);
  }
}
