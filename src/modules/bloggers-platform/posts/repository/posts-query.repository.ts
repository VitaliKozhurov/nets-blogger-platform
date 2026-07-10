import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortDirection } from 'src/core/dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/browser';
import { LikeStatus } from '../../likes/domain/dto';
import { PostLikeEntity } from '../../likes/domain/post-like.entity';
import { PostsSortBy } from '../domain/dto';
import { PostEntity } from '../domain/post.entity';
import { IGetPostParamsDto } from './dto/get-post.params.dto';
import { IGetPostsParamsDto } from './dto/get-posts.params.dto';
import { INewestLike } from './dto/newest-like.dto';
import { IPostWithDetails } from './dto/post-with-details.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>) {}

  async findAll(args: Omit<IGetPostsParamsDto, 'blogId'>): Promise<{
    posts: { post: IPostWithDetails; newestLikes: INewestLike[] }[];
    totalCount: number;
  }> {
    const { query, userId } = args;
    const { sortBy, sortDirection, limit, offset } = query;

    const orderByField = sortBy === PostsSortBy.BlogName ? `blog.name` : `p.${sortBy}`;

    const postLikesCounts = (sq: SelectQueryBuilder<PostLikeEntity>) =>
      sq
        .select(['pl.postId as "postId"', 'count(*) as "count"'])
        .from(PostLikeEntity, 'pl')
        .where('pl.status = :likeStatus', { likeStatus: LikeStatus.Like })
        .groupBy('pl."postId"');

    const postDislikesCounts = (sq: SelectQueryBuilder<PostLikeEntity>) =>
      sq
        .select(['pl.postId as "postId"', 'count(*) as "count"'])
        .from(PostLikeEntity, 'pl')
        .where('pl.status = :dislikeStatus', { dislikeStatus: LikeStatus.Dislike })
        .groupBy('pl."postId"');

    const postsQuery = this.postsRepo
      .createQueryBuilder('p')
      .select([
        'p.id as "id"',
        'p.title as "title"',
        'p.shortDescription as "shortDescription"',
        'p.content as "content"',
        'p.blogId as "blogId"',
        'p.createdAt as "createdAt"',
        'CAST(COALESCE(like_count.count, 0) AS INTEGER) as "likesCount"', // ✅ CAST
        'CAST(COALESCE(dislike_count.count, 0) AS INTEGER) as "dislikesCount"', // ✅ CAS
        'blog.name as "blogName"',
      ])
      .addSelect(`COALESCE(my_like.status, 'None')`, 'myStatus')
      .addSelect(
        `COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'postId', newest_likes."postId",
          'userId', newest_likes."userId",
          'addedAt', newest_likes."createdAt",
          'login', newest_likes."login"
        )
        ORDER BY newest_likes."createdAt" DESC
      ) FILTER (WHERE newest_likes."userId" IS NOT NULL),
      '[]'::jsonb
    )`,
        'newestLikes'
      )
      .where('p.deletedAt IS NULL')
      .leftJoin('p.blog', 'blog')
      .leftJoin(
        PostLikeEntity,
        'my_like',
        'my_like."postId" = p."id" AND my_like."userId" = :userId',
        { userId: userId ?? null }
      )
      .leftJoin(
        subQuery =>
          subQuery
            .select([
              'newest_likes.postId as "postId"',
              'newest_likes.userId as "userId"',
              'newest_likes.createdAt as "createdAt"',
              'user.login as "login"',
              'ROW_NUMBER() OVER (PARTITION BY newest_likes."postId" ORDER BY newest_likes."createdAt" DESC) as rank',
            ])
            .from(PostLikeEntity, 'newest_likes')
            .where('newest_likes.status = :postLikeStatus', { postLikeStatus: LikeStatus.Like })
            .leftJoin('newest_likes.user', 'user'),
        'newest_likes',
        'newest_likes."postId" = p."id" AND newest_likes.rank <= 3'
      )
      .leftJoin(postLikesCounts, 'like_count', '"like_count"."postId" = p."id"')
      .leftJoin(postDislikesCounts, 'dislike_count', '"dislike_count"."postId" = p."id"')
      .groupBy('p.id')
      .addGroupBy('blog.name')
      .addGroupBy('my_like.status')
      .addGroupBy('like_count.count')
      .addGroupBy('dislike_count.count')
      .orderBy(orderByField, sortDirection === SortDirection.Asc ? 'ASC' : 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany();

    const totalCountQuery = this.postsRepo.createQueryBuilder('p').getCount();

    const [posts, totalCount] = await Promise.all([postsQuery, totalCountQuery]);

    const result = posts.map(p => ({
      post: {
        id: p.id,
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt,
        likesCount: p.likesCount,
        dislikesCount: p.dislikesCount,
        myStatus: p.myStatus,
      },
      newestLikes: p.newestLikes.map(like => ({
        ...like,
        addedAt: new Date(like.addedAt),
      })),
    }));

    return { posts: result, totalCount };
  }

  async findAllForBlogId(args: IGetPostsParamsDto): Promise<{
    posts: { post: IPostWithDetails; newestLikes: INewestLike[] }[];
    totalCount: number;
  }> {
    const { blogId, userId, query } = args;

    const { sortBy, sortDirection, limit, offset } = query;

    const postsQuery = this.postsRepo
      .createQueryBuilder('p')
      .select([
        'p.id as "id"',
        'p.title as "title"',
        'p.shortDescription as "shortDescription"',
        'p.content as "content"',
        'p.blogId as "blogId"',
        'p.createdAt as "createdAt"',
        'CAST(COALESCE(like_count.count, 0) AS INTEGER) as "likesCount"', // ✅ CAST
        'CAST(COALESCE(dislike_count.count, 0) AS INTEGER) as "dislikesCount"', // ✅ CAS
        'blog.name as "blogName"',
      ])
      .addSelect(`COALESCE(my_like.status, 'None')`, 'myStatus')
      .addSelect(
        `COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'postId', newest_likes."postId",
          'userId', newest_likes."userId",
          'addedAt', newest_likes."createdAt",
          'login', newest_likes."login"
        )
        ORDER BY newest_likes."createdAt" DESC
      ) FILTER (WHERE newest_likes."userId" IS NOT NULL),
      '[]'::jsonb
    )`,
        'newestLikes'
      )
      .where('p.blogId = :blogId', { blogId })
      .andWhere('p.deletedAt IS NULL')
      .leftJoin(
        PostLikeEntity,
        'my_like',
        'my_like."postId" = p."id" AND my_like."userId" = :userId',
        { userId: userId ?? null }
      )
      .leftJoin(
        subQuery =>
          subQuery
            .select([
              'newest_likes.postId as "postId"',
              'newest_likes.userId as "userId"',
              'newest_likes.createdAt as "createdAt"',
              'user.login as "login"',
              'ROW_NUMBER() OVER (PARTITION BY newest_likes."postId" ORDER BY newest_likes."createdAt" DESC) as rank',
            ])
            .from(PostLikeEntity, 'newest_likes')
            .where('newest_likes.status = :postLikeStatus', { postLikeStatus: LikeStatus.Like })
            .leftJoin('newest_likes.user', 'user'),
        'newest_likes',
        'newest_likes."postId" = p."id" AND newest_likes.rank <= 3'
      )
      .leftJoin('p.blog', 'blog')
      .leftJoin(
        subQuery => {
          return subQuery
            .select('pl."postId"')
            .addSelect('COUNT(*)', 'count')
            .from(PostLikeEntity, 'pl')
            .where('pl.status = :likeStatus', { likeStatus: LikeStatus.Like })
            .groupBy('pl."postId"');
        },
        'like_count',
        'like_count."postId" = p.id'
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('pl."postId"')
            .addSelect('COUNT(*)', 'count')
            .from(PostLikeEntity, 'pl')
            .where('pl.status = :dislikeStatus', { dislikeStatus: LikeStatus.Dislike })
            .groupBy('pl."postId"');
        },
        'dislike_count',
        'dislike_count."postId" = p.id'
      )
      .groupBy('p.id')
      .addGroupBy('blog.name')
      .addGroupBy('my_like.status')
      .addGroupBy('like_count.count')
      .addGroupBy('dislike_count.count')
      .orderBy(`p.${sortBy}`, sortDirection === SortDirection.Asc ? 'ASC' : 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany();

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
        blogName: p.blogName,
        createdAt: p.createdAt,
        likesCount: p.likesCount,
        dislikesCount: p.dislikesCount,
        myStatus: p.myStatus,
      },
      newestLikes: p.newestLikes.map(like => ({
        ...like,
        addedAt: new Date(like.addedAt),
      })),
    }));

    return { posts: result, totalCount };
  }

  async findById(
    args: IGetPostParamsDto
  ): Promise<{ post: IPostWithDetails; newestLikes: INewestLike[] } | null> {
    const { postId, userId } = args;

    const post = await this.postsRepo
      .createQueryBuilder('p')
      .select([
        'p.id as "id"',
        'p.title as "title"',
        'p.shortDescription as "shortDescription"',
        'p.content as "content"',
        'p.blogId as "blogId"',
        'p.createdAt as "createdAt"',
        'CAST(COALESCE(like_count.count, 0) AS INTEGER) as "likesCount"', // ✅ CAST
        'CAST(COALESCE(dislike_count.count, 0) AS INTEGER) as "dislikesCount"', // ✅ CAS
        'blog.name as "blogName"',
      ])
      .addSelect(`COALESCE(my_like.status, 'None')`, 'myStatus')
      .addSelect(
        `COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'postId', newest_likes."postId",
          'userId', newest_likes."userId",
          'addedAt', newest_likes."createdAt",
          'login', newest_likes."login"
        )
        ORDER BY newest_likes."createdAt" DESC
      ) FILTER (WHERE newest_likes."userId" IS NOT NULL),
      '[]'::jsonb
    )`,
        'newestLikes'
      )
      .where('p.id = :postId AND p.deletedAt IS NULL', { postId })
      .leftJoin(
        PostLikeEntity,
        'my_like',
        'my_like."postId" = p."id" AND my_like."userId" = :userId',
        { userId: userId ?? null }
      )
      .leftJoin(
        subQuery =>
          subQuery
            .select([
              'newest_likes.postId as "postId"',
              'newest_likes.userId as "userId"',
              'newest_likes.createdAt as "createdAt"',
              'user.login as "login"',
              'ROW_NUMBER() OVER (PARTITION BY newest_likes."postId" ORDER BY newest_likes."createdAt" DESC) as rank',
            ])
            .from(PostLikeEntity, 'newest_likes')
            .where('newest_likes.status = :postLikeStatus', { postLikeStatus: LikeStatus.Like })
            .leftJoin('newest_likes.user', 'user'),
        'newest_likes',
        'newest_likes."postId" = p."id" AND newest_likes.rank <= 3'
      )
      .leftJoin('p.blog', 'blog')
      .leftJoin(
        subQuery => {
          return subQuery
            .select('pl."postId"')
            .addSelect('COUNT(*)', 'count')
            .from(PostLikeEntity, 'pl')
            .where('pl.status = :likeStatus', { likeStatus: LikeStatus.Like })
            .groupBy('pl."postId"');
        },
        'like_count',
        'like_count."postId" = p.id'
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('pl."postId"')
            .addSelect('COUNT(*)', 'count')
            .from(PostLikeEntity, 'pl')
            .where('pl.status = :dislikeStatus', { dislikeStatus: LikeStatus.Dislike })
            .groupBy('pl."postId"');
        },
        'dislike_count',
        'dislike_count."postId" = p.id'
      )
      .groupBy('p.id')
      .addGroupBy('blog.name')
      .addGroupBy('my_like.status')
      .addGroupBy('like_count.count')
      .addGroupBy('dislike_count.count')
      .getRawOne();

    return post
      ? {
          post: {
            id: post.id,
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
            myStatus: post.myStatus,
          },
          newestLikes: post.newestLikes.map(like => ({
            ...like,
            addedAt: new Date(like.addedAt),
          })),
        }
      : null;
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
