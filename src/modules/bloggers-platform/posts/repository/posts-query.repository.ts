import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { getPaginationParams } from 'src/core/utils';
import { DataSource } from 'typeorm';
import { IGetPostsQueryDto, PostResponseMapperDto } from '../api/dto';
import { INewestLike } from './dto/newest-like.dto';
import { IPostRepository } from './dto/post-repository.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAll(args: {
    query: IGetPostsQueryDto;
    userId?: string;
  }): Promise<PaginationResponseMapperDto<PostResponseMapperDto[]>> {
    const { query, userId } = args;
    const { skip, limit } = getPaginationParams(query);
    const { sortBy, sortDirection } = query;

    const sortColumn = `"${sortBy}"`;

    const postsPromise: Promise<IPostRepository[]> = this.dataSource.query(
      `
          SELECT p.*, 
            b."name" as "blogName",
            (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND status = 'Like')::int as "likesCount",
            (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND status = 'Dislike')::int as "dislikesCount",
            COALESCE(
            (SELECT status FROM post_likes pl WHERE pl."postId" = p."id" AND "userId" = $3 LIMIT 1),
            'None') as "myStatus"
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."deletedAt" IS NULL
            ORDER BY ${sortColumn} ${sortDirection}
            LIMIT $1
            OFFSET $2
          `,
      [limit, skip, userId ?? null]
    );

    const totalCountPromise: Promise<[{ count: string }]> = this.dataSource.query(
      `
          SELECT COUNT(*)
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."deletedAt" IS NULL
          `,
      []
    );

    const [posts, countResult] = await Promise.all([postsPromise, totalCountPromise]);

    const postMap = posts.map(p => p.id);

    const newestLikes: ({ postId: string } & INewestLike)[] = await this.dataSource.query(
      `
          SELECT ranked."postId", ranked."addedAt", ranked."userId", ranked."login"
            FROM (
               SELECT 
                  pl."postId",
                  pl."createdAt" as "addedAt",
                  u."id" as "userId",
                  u."login",
                  ROW_NUMBER() OVER (
                  PARTITION BY pl."postId"
                  ORDER BY pl."createdAt" DESC
                  ) as rn
                FROM post_likes pl
                LEFT JOIN users u ON pl."userId" = u."id"
                WHERE pl."postId" = ANY($1) AND pl.status = 'Like'
                  ) ranked
              WHERE ranked.rn <= 3
              ORDER BY ranked."postId", ranked."addedAt" DESC
          `,
      [postMap]
    );

    const entries = newestLikes.reduce<Record<string, INewestLike[]>>((acc, curr) => {
      const { postId, ...restData } = curr;

      if (acc[postId]) {
        acc[postId].push(restData);
      } else {
        acc[postId] = [restData];
      }

      return acc;
    }, {});

    const items = posts.map(post =>
      PostResponseMapperDto.mapToView({
        post,
        newestLikes: entries[post.id] ?? [],
      })
    );

    return PaginationResponseMapperDto.mapToViewModel({
      items,
      totalCount: Number(countResult[0].count),
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findAllForBlogId(args: {
    blogId: string;
    userId?: string;
    query: IGetPostsQueryDto;
  }): Promise<PaginationResponseMapperDto<PostResponseMapperDto[]>> {
    const { blogId, userId, query } = args;

    const { skip, limit } = getPaginationParams(query);
    const { sortBy, sortDirection } = query;

    const sortColumn = `"${sortBy}"`;

    const postsPromise: Promise<IPostRepository[]> = this.dataSource.query(
      `
          SELECT p.*, 
            b."name" as "blogName",
            (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND status = 'Like')::int as "likesCount",
            (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND status = 'Dislike')::int as "dislikesCount",
            COALESCE(
            (SELECT status FROM post_likes pl WHERE pl."postId" = p."id" AND "userId" = $3 LIMIT 1),
            'None') as "myStatus"
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."blogId" = $4 AND p."deletedAt" IS NULL
            ORDER BY ${sortColumn} ${sortDirection}
            LIMIT $1
            OFFSET $2
          `,
      [limit, skip, userId ?? null, blogId]
    );

    const totalCountPromise: Promise<[{ count: string }]> = this.dataSource.query(
      `
          SELECT COUNT(*)
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."blogId" = $1 AND p."deletedAt" IS NULL
          `,
      [blogId]
    );

    const [posts, countResult] = await Promise.all([postsPromise, totalCountPromise]);

    const postMap = posts.map(p => p.id);

    const newestLikes: ({ postId: string } & INewestLike)[] = await this.dataSource.query(
      `
          SELECT ranked."postId", ranked."addedAt", ranked."userId", ranked."login"
            FROM (
               SELECT 
                  pl."postId",
                  pl."createdAt" as "addedAt",
                  u."id" as "userId",
                  u."login",
                  ROW_NUMBER() OVER (
                  PARTITION BY pl."postId"
                  ORDER BY pl."createdAt" DESC
                  ) as rn
                FROM post_likes pl
                LEFT JOIN users u ON pl."userId" = u."id"
                WHERE pl."postId" = ANY($1) AND pl.status = 'Like'
                  ) ranked
              WHERE ranked.rn <= 3
              ORDER BY ranked."postId", ranked."addedAt" DESC
          `,
      [postMap]
    );

    const entries = newestLikes.reduce<Record<string, INewestLike[]>>((acc, curr) => {
      const { postId, ...restData } = curr;

      if (acc[postId]) {
        acc[postId].push(restData);
      } else {
        acc[postId] = [restData];
      }

      return acc;
    }, {});

    const items = posts.map(post =>
      PostResponseMapperDto.mapToView({
        post,
        newestLikes: entries[post.id] ?? [],
      })
    );

    return PaginationResponseMapperDto.mapToViewModel({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount: Number(countResult[0].count),
    });
  }

  async findById(args: { postId: string; userId?: string }): Promise<PostResponseMapperDto | null> {
    const { postId, userId } = args;

    const newestLikes: INewestLike[] = await this.dataSource.query(
      `
      SELECT pl."createdAt" as "addedAt",pl. "userId", u."login"
          FROM post_likes pl
          LEFT JOIN users u ON pl."userId" = u."id"
          WHERE pl."postId" = $1 AND pl.status = 'Like'
          ORDER BY pl."createdAt" DESC
          LIMIT 3
      `,
      [postId]
    );

    const [post]: IPostRepository[] = await this.dataSource.query(
      `
      SELECT p.*, 
          b."name" as "blogName", 
          (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND pl.status = 'Like')::int as "likesCount",
          (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND pl.status = 'Dislike')::int as "dislikesCount",
          COALESCE(
          (SELECT pl.status FROM post_likes pl WHERE pl."postId" = p."id" AND pl."userId" = $2 LIMIT 1),
          'None') as "myStatus"
            FROM posts p
            LEFT JOIN blogs b ON p."blogId" = b."id"
            WHERE p."id" = $1 AND p."deletedAt" IS NULL
          `,
      [postId, userId ?? null]
    );

    return post ? PostResponseMapperDto.mapToView({ post, newestLikes }) : null;
  }

  async findByIdOrThrow(args: { postId: string; userId?: string }): Promise<PostResponseMapperDto> {
    const post = await this.findById(args);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    return post;
  }
}
