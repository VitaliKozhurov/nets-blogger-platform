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
import { PostsSortBy } from '../domain/dto';

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
    const { query, userId: _userId } = args;
    const { sortBy, sortDirection, limit, offset } = query;

    const orderByField = sortBy === PostsSortBy.BlogName ? `blog.name` : `post.${sortBy}`;

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
      .where('post.deletedAt IS NULL')
      .orderBy(orderByField, sortDirection === SortDirection.Asc ? 'ASC' : 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    const totalCountQuery = this.postsRepo.createQueryBuilder('post').getCount();

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

  async findAllForBlogId(args: IGetPostsParamsDto): Promise<{
    posts: { post: IPostWithDetails; newestLikes: INewestLike[] }[];
    totalCount: number;
  }> {
    const { blogId, userId: _userId, query } = args;

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
      .andWhere('post.deletedAt IS NULL')
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
    const { postId, userId: _userId } = args;

    const post = await this.postsRepo
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
      .where('post.id = :postId', { postId })
      .getOne();

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
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None,
          },
          newestLikes: [],
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
