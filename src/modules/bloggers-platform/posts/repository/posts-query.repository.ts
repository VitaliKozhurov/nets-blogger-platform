import { Injectable } from '@nestjs/common';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { getPaginationParams } from 'src/core/utils';
import { LikeStatus } from '@modules/bloggers-platform/likes/domain';
import { IGetPostsQueryDto, PostResponseMapperDto } from '../api/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { IPostRepository } from './dto/post-repository.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAll(args: {
    query: IGetPostsQueryDto;
    userId?: string;
  }): Promise<PaginationResponseMapperDto<PostResponseMapperDto[]>> {
    const { query, userId: _ } = args;
    const { skip, limit } = getPaginationParams(query);
    const { sortBy, sortDirection } = query;

    const sortColumn = `"${sortBy}"`;

    const postsPromise: Promise<IPostRepository[]> = this.dataSource.query(
      `
          SELECT *, b."name" as blogName
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE "deletedAt" IS NULL
            ORDER BY ${sortColumn} ${sortDirection}
            LIMIT $1
            OFFSET $2
          `,
      [limit, skip]
    );

    const totalCountPromise = this.dataSource.query(
      `
          SELECT COUNT(*)
            FROM posts p
            WHERE "deletedAt" IS NULL
          `,
      []
    );

    const [posts, totalCount] = await Promise.all([postsPromise, totalCountPromise]);

    const items = posts.map(post =>
      PostResponseMapperDto.mapToView({
        post,
        myStatus: LikeStatus.None,
        newestLikes: [],
      })
    );

    return PaginationResponseMapperDto.mapToViewModel({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findAllForBlogId(args: {
    blogId: string;
    userId?: string;
    query: IGetPostsQueryDto;
  }): Promise<PaginationResponseMapperDto<PostResponseMapperDto[]>> {
    const { blogId, userId: _, query } = args;

    const { skip, limit } = getPaginationParams(query);
    const { sortBy, sortDirection } = query;

    const sortColumn = `"${sortBy}"`;

    const postsPromise: Promise<IPostRepository[]> = this.dataSource.query(
      `
          SELECT *, b."name" as blogName
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."blogId" = $1 AND "deletedAt" IS NULL
            ORDER BY ${sortColumn} ${sortDirection}
            LIMIT $2
            OFFSET $3
          `,
      [blogId, limit, skip]
    );

    const totalCountPromise = this.dataSource.query(
      `
          SELECT COUNT(*)
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."blogId" = $1 AND "deletedAt" IS NULL
          `,
      [blogId]
    );

    const [posts, totalCount] = await Promise.all([postsPromise, totalCountPromise]);

    const items = posts.map(post =>
      PostResponseMapperDto.mapToView({
        post,
        myStatus: LikeStatus.None,
        newestLikes: [],
      })
    );

    return PaginationResponseMapperDto.mapToViewModel({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findByIdOrThrow(args: { postId: string; userId?: string }): Promise<PostResponseMapperDto> {
    const { postId } = args;

    const [post]: IPostRepository[] = await this.dataSource.query(
      `
          SELECT *, b."name" as blogName
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."id" = $1 "deletedAt" IS NULL
          `,
      [postId]
    );

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    return PostResponseMapperDto.mapToView({ post, myStatus: LikeStatus.None, newestLikes: [] });
  }
}
