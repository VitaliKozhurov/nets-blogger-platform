import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { DataSource, Repository } from 'typeorm';
import { INewestLike } from './dto/newest-like.dto';
import { IPostWithDetails } from './dto/post-with-details.dto';
import { IGetPostsParamsDto } from './dto/get-posts.params.dto';
import { IGetPostParamsDto } from './dto/get-post.params.dto';
import { PostEntity } from '../domain/post.entity';
import { LikeStatus } from '../../likes/domain/dto';
import { SortDirection } from 'src/core/dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>
  ) {}

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
    const { blogId, query } = args;

    const { sortBy, sortDirection, limit, offset } = query;

    const postsQuery = this.postsRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog')
      .select([
        'post.id',
        'post.title',
        'post.shortDescription',
        'post.content',
        'post.blogId',
        'post.createdAt',
        'blog.name',
      ])
      .where('post.blogId = :blogId', { blogId })
      .orderBy(`post.${sortBy}`, sortDirection === SortDirection.Asc ? 'ASC' : 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    const totalCountQuery = this.postsRepo
      .createQueryBuilder('post')
      .where('post.blogId = :blogId', { blogId })
      .getCount();

    const [posts, totalCount] = await Promise.all([postsQuery, totalCountQuery]);

    const result = posts.map(p => ({
      post: {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blog.name,
        createdAt: p.createdAt,
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
      newestLikes: [],
    }));

    return { posts: result, totalCount };
  }

  async findById(
    args: IGetPostParamsDto
  ): Promise<{ post: IPostWithDetails; newestLikes: INewestLike[] } | null> {
    const { postId, userId } = args;

    const [post]: IPostWithDetails[] = await this.dataSource.query(
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

    return post ? { post, newestLikes } : null;
  }

  async findByIdOrThrow(
    args: IGetPostParamsDto
  ): Promise<{ post: IPostWithDetails; newestLikes: INewestLike[] }> {
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
