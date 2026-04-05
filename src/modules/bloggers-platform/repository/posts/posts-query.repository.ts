import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { LikeDocument } from '../../domain/likes/like.types';
import { Post } from '../../domain/posts/post.schema';
import { PostDocument, type PostModelType } from '../../domain/posts/post.types';

import { LikesRepository } from '../likes/likes.repository';
import { IGetPostsQueryParamsDto } from '../../dto/contracts/post.dto';
import { getPaginationParams } from 'src/core/utils';
import { PaginationResponseMapperDto } from 'src/core/dto';
import { PostResponseMapperDto } from '../../dto/mappers/post.mapper';
import { LikeStatus } from '../../dto/contracts/like.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @Inject() private likesRepository: LikesRepository
  ) {}

  async findAll(args: {
    query: IGetPostsQueryParamsDto;
    userId?: string;
  }): Promise<PaginationResponseMapperDto<PostResponseMapperDto[]>> {
    const { query, userId } = args;

    const { sort, skip, limit } = getPaginationParams(query);

    const postsPromise = this.PostModel.find({ deletedAtL: null })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalCountPromise = this.PostModel.countDocuments({ deletedAt: null }).exec();

    const [posts, totalCount] = await Promise.all([postsPromise, totalCountPromise]);

    const postsWithLikeInfo = await this.enrichWithLikes({ posts, userId });

    const items = postsWithLikeInfo.map(post => PostResponseMapperDto.mapToView(post));

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
    query: IGetPostsQueryParamsDto;
  }): Promise<PaginationResponseMapperDto<PostResponseMapperDto[]>> {
    const { blogId, userId, query } = args;

    const { sort, skip, limit } = getPaginationParams(query);

    const postsPromise = this.PostModel.find({ blogId, deletedAt: null })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const totalCountPromise = this.PostModel.countDocuments({ blogId, deletedAt: null }).exec();

    const [posts, totalCount] = await Promise.all([postsPromise, totalCountPromise]);

    const postsWithLikeInfo = await this.enrichWithLikes({ posts, userId });

    const items = postsWithLikeInfo.map(post => PostResponseMapperDto.mapToView(post));

    return PaginationResponseMapperDto.mapToViewModel({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findByIdOrThrow(args: { postId: string; userId?: string }): Promise<PostResponseMapperDto> {
    const { postId, userId } = args;

    const post = await this.PostModel.findOne({ _id: postId, deletedAt: null }).lean().exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const myStatusPromise = userId
      ? this.likesRepository.getMyStatus({ parentId: postId, authorId: userId })
      : Promise.resolve(LikeStatus.None);

    const newestLikesPromise = this.likesRepository.getNewestLikes({ parentId: postId });

    const [myStatus, newestLikes] = await Promise.all([myStatusPromise, newestLikesPromise]);

    return PostResponseMapperDto.mapToView({ postDocument: post, myStatus, newestLikes });
  }

  async enrichWithLikes(args: { posts: PostDocument[]; userId?: string }) {
    const { posts, userId } = args;

    if (posts.length === 0) return [];

    const likesMap = new Map<string, LikeStatus>();
    const newestLikesMap = new Map<string, LikeDocument[]>();

    const postsIds = posts.map(p => p._id.toString());

    const userLikesPromise = userId
      ? this.likesRepository.getLikesForUser({
          parentIds: postsIds,
          authorId: userId,
        })
      : Promise.resolve([]);

    const newestLikesPromise = this.likesRepository.getNewestLikesForParents({
      parentIds: postsIds,
    });

    const [userLikes, newestLikes] = await Promise.all([userLikesPromise, newestLikesPromise]);

    userLikes.forEach(like => likesMap.set(like.parentId, like.status));
    newestLikes.forEach(group => newestLikesMap.set(group._id.toString(), group.newestLikes));

    return posts.map(post => {
      const myStatus = userId
        ? (likesMap.get(post._id.toString()) ?? LikeStatus.None)
        : LikeStatus.None;

      return {
        postDocument: post,
        myStatus,
        newestLikes: newestLikesMap.get(post._id.toString()) ?? [],
      };
    });
  }
}
