import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource } from 'typeorm';
import { INewestLike } from './dto/newest-like.dto';
import { IPostWithDetails } from './dto/post-with-details.dto';
import { IGetPostsParamsDto } from './dto/get-posts.params.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findAll(args: Omit<IGetPostsParamsDto, 'blogId'>): Promise<{
    posts: { post: IPostWithDetails; newestLikes: INewestLike[] }[];
    totalCount: number;
  }> {
    const { query, userId } = args;
    const { sortBy, sortDirection, limit, offset } = query;

    const postsPromise: Promise<IPostWithDetails[]> = this.dataSource.query(
      `
          SELECT p.*, 
            b."name" as "blogName",
            (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND status = 'Like')::int as "likesCount",
            (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND status = 'Dislike')::int as "dislikesCount",
            COALESCE(
            (SELECT status FROM post_likes pl WHERE pl."postId" = p."id" AND "userId" = $1 LIMIT 1),
            'None') as "myStatus"
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."deletedAt" IS NULL
            ORDER BY ${`"${sortBy}"`} ${sortDirection}
            LIMIT $2
            OFFSET $3
          `,
      [userId ?? null, limit, offset]
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

    const rawPosts = posts.map(post => ({
      post,
      newestLikes: entries[post.id] ?? [],
    }));

    return { posts: rawPosts, totalCount: Number(countResult[0].count) };
  }

  async findAllForBlogId(args: IGetPostsParamsDto): Promise<{
    posts: { post: IPostWithDetails; newestLikes: INewestLike[] }[];
    totalCount: number;
  }> {
    const { blogId, userId, query } = args;

    const { sortBy, sortDirection, limit, offset } = query;

    const postsPromise: Promise<IPostWithDetails[]> = this.dataSource.query(
      `
          SELECT p.*, 
            b."name" as "blogName",
            (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND status = 'Like')::int as "likesCount",
            (SELECT COUNT(*) FROM post_likes pl WHERE pl."postId" = p."id" AND status = 'Dislike')::int as "dislikesCount",
            COALESCE(
            (SELECT status FROM post_likes pl WHERE pl."postId" = p."id" AND "userId" = $1 LIMIT 1),
            'None') as "myStatus"
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."blogId" = $3 AND p."deletedAt" IS NULL
            ORDER BY ${`"${sortBy}"`} ${sortDirection}
            LIMIT $3
            OFFSET $4
          `,
      [userId ?? null, blogId, limit, offset]
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

    const rawPosts = posts.map(post => ({
      post,
      newestLikes: entries[post.id] ?? [],
    }));

    return { posts: rawPosts, totalCount: Number(countResult[0].count) };
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
