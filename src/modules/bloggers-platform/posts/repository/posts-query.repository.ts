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
        .select(['pl.postId as "postId"', 'count(*) as "likesCount"'])
        .from(PostLikeEntity, 'pl')
        .where('pl.status = :status', { status: LikeStatus.Like })
        .groupBy('pl."postId"');

    const postDislikesCounts = (sq: SelectQueryBuilder<PostLikeEntity>) =>
      sq
        .select(['pl.postId as "postId"', 'count(*) as "dislikesCount"'])
        .from(PostLikeEntity, 'pl')
        .where('pl.status = :status', { status: LikeStatus.Dislike })
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
        'blog.name',
        '"postLikesCounts"."likesCount" as "likesCount"',
        '"postDislikesCounts"."dislikesCount" as "dislikesCount"',
      ])
      .addSelect(
        sq =>
          sq
            .select("COALESCE(pl.status, 'None')")
            .from(PostLikeEntity, 'pl')
            .where('pl."postId" = p."id"')
            .andWhere('pl."userId" = :userId', { userId })
            .limit(1),
        'myStatus'
      )
      .where('p.deletedAt IS NULL')
      .leftJoinAndMapMany(
        'p."newestLikes"',
        subQuery =>
          subQuery
            .select([
              'inner_pl.postId as "postId"',
              'inner_pl.userId as "userId"',
              'inner_pl.createdAt as "addedAt"',
              'user.login as "login"',
              'ROW_NUMBER() OVER (PARTITION BY inner_pl."postId" ORDER BY inner_pl."createdAt" DESC) as rank',
            ])
            .from(PostLikeEntity, 'inner_pl')
            .leftJoin('inner_pl.user', 'user'),
        'inner_pl',
        'inner_pl."postId" = p."id" AND inner_pl.rank <= 3'
      )
      .leftJoin('p.blog', 'blog')
      .leftJoin(postLikesCounts, 'postLikesCounts', '"postLikesCounts"."postId" = p."id"')
      .leftJoin(postDislikesCounts, 'postDislikesCounts', '"postDislikesCounts"."postId" = p."id"')
      .orderBy(orderByField, sortDirection === SortDirection.Asc ? 'ASC' : 'DESC')
      .skip(offset)
      .take(limit)
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
        blogName: p.blog.name,
        createdAt: p.createdAt,
        likesCount: p.likesCount,
        dislikesCount: p.dislikesCount,
        myStatus: p.myStatus,
      },
      newestLikes: p.newestLikes,
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
        'p.id',
        'p.title',
        'p.shortDescription',
        'p.content',
        'p.blogId',
        'p.createdAt',
        'likesCount."likesCount"',
        'dislikesCount."dislikesCount"',
        'blog.name',
      ])
      .addSelect(
        sq =>
          sq
            .select("COALESCE(pl.status, 'None')")
            .from(PostLikeEntity, 'pl')
            .where('pl."postId" = p."id"')
            .andWhere('pl."userId" = :userId', { userId })
            .limit(1),
        'myStatus'
      )
      .where('p', { blogId })
      .andWhere('p.deletedAt IS NULL')
      .leftJoinAndMapMany(
        'p."newestLikes"',
        subQuery =>
          subQuery
            .select([
              'inner_pl.postId as "postId"',
              'inner_pl.userId as "userId"',
              'inner_pl.createdAt as "addedAt"',
              'user.login as "login"',
              'ROW_NUMBER() OVER (PARTITION BY inner_pl."postId" ORDER BY inner_pl."createdAt" DESC) as rank',
            ])
            .from(PostLikeEntity, 'inner_pl')
            .leftJoin('inner_pl.user', 'user'),
        'inner_pl',
        'inner_pl."postId" = p."id" AND inner_pl.rank <= 3'
      )
      .leftJoin('p.blog', 'blog')
      .leftJoin(
        subQuery => {
          return subQuery
            .select('pl."postId"')
            .addSelect('COUNT(*)', 'likesCount')
            .from(PostLikeEntity, 'pl')
            .where('pl.status = :likeStatus', { likeStatus: LikeStatus.Like })
            .groupBy('pl."postId"');
        },
        'likesCount',
        'likesCount."postId" = p.id'
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('pl."postId"')
            .addSelect('COUNT(*)', 'dislikesCount')
            .from(PostLikeEntity, 'pl')
            .where('pl.status = :likeStatus', { likeStatus: LikeStatus.Dislike })
            .groupBy('pl."postId"');
        },
        'dislikesCount',
        'dislikesCount."postId" = p.id'
      )
      .orderBy(`post.${sortBy}`, sortDirection === SortDirection.Asc ? 'ASC' : 'DESC')
      .skip(offset)
      .take(limit)
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
        blogName: p.blog.name,
        createdAt: p.createdAt,
        likesCount: p.likesCount,
        dislikesCount: p.dislikesCount,
        myStatus: p.myStatus,
      },
      newestLikes: p.newestLikes,
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
        'p.id',
        'p.title',
        'p.shortDescription',
        'p.content',
        'p.blogId',
        'p.createdAt',
        'likesCount."likesCount"',
        'dislikesCount."dislikesCount"',
        'blog.name',
      ])
      .addSelect(
        sq =>
          sq
            .select("COALESCE(pl.status, 'None')")
            .from(PostLikeEntity, 'pl')
            .where('pl."postId" = p."id"')
            .andWhere('pl."userId" = :userId', { userId })
            .limit(1),
        'myStatus'
      )
      .where('p.id = :postId AND p.deletedAt IS NULL', { postId })
      .leftJoinAndMapMany(
        'p."newestLikes"',
        subQuery =>
          subQuery
            .select([
              'inner_pl.postId as "postId"',
              'inner_pl.userId as "userId"',
              'inner_pl.createdAt as "addedAt"',
              'user.login as "login"',
              'ROW_NUMBER() OVER (PARTITION BY inner_pl."postId" ORDER BY inner_pl."createdAt" DESC) as rank',
            ])
            .from(PostLikeEntity, 'inner_pl')
            .leftJoin('inner_pl.user', 'user'),
        'inner_pl',
        'inner_pl."postId" = p."id" AND inner_pl.rank <= 3'
      )
      .leftJoin('p.blog', 'blog')
      .leftJoin(
        subQuery => {
          return subQuery
            .select('pl."postId"', 'postId')
            .addSelect('COUNT(*)', 'likesCount')
            .from(PostLikeEntity, 'pl')
            .where('pl.status = :likeStatus', { likeStatus: LikeStatus.Like })
            .groupBy('pl."postId"');
        },
        'likesCount',
        'likesCount."postId" = p.id'
      )
      .leftJoin(
        subQuery => {
          return subQuery
            .select('pl."postId"', 'postId')
            .addSelect('COUNT(*)', 'dislikesCount')
            .from(PostLikeEntity, 'pl')
            .where('pl.status = :likeStatus', { likeStatus: LikeStatus.Dislike })
            .groupBy('pl."postId"');
        },
        'dislikesCount',
        'dislikesCount."postId" = p.id'
      )
      .getRawOne();

    return post
      ? {
          post: {
            id: post.id,
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: post.blog.name,
            createdAt: post.createdAt,
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
            myStatus: post.myStatus,
          },
          newestLikes: post.newestLikes,
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
