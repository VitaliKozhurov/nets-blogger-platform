import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationResponseDto } from 'src/core/dto';
import { LikeDocument } from '../../domain/likes/like.types';
import { Post } from '../../domain/posts/post.schema';
import { PostDocument, type PostModelType } from '../../domain/posts/post.types';
import { GetPostsByBlogIdQueryParamsDto } from '../../dto/blogs/get-posts-by-blog-id-query-params.dto';
import { GetPostsQueryParamsDto } from '../../dto/posts/get-posts-query-params.dto';
import { PostResponseDto } from '../../dto/posts/post-response.dto';
import { LikeStatus } from '../../types/likes/like-status.types';
import { LikesRepository } from '../likes/likes.repository';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @Inject() private likesRepository: LikesRepository
  ) {}

  async findAll(args: {
    query: GetPostsQueryParamsDto;
    userId?: string;
  }): Promise<PaginationResponseDto<PostResponseDto[]>> {
    const { query, userId } = args;

    const postsPromise = this.PostModel.find({ deletedAtL: null })
      .sort(query.getSortOptions())
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .lean()
      .exec();

    const totalCountPromise = this.PostModel.countDocuments({ deletedAt: null }).exec();

    const [posts, totalCount] = await Promise.all([postsPromise, totalCountPromise]);

    const postsWithLikeInfo = await this.enrichWithLikes({ posts, userId });

    const items = postsWithLikeInfo.map(post => PostResponseDto.mapToView(post));

    return PaginationResponseDto.mapToViewModel({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findAllForBlogId(args: {
    blogId: string;
    userId?: string;
    query: GetPostsByBlogIdQueryParamsDto;
  }): Promise<PaginationResponseDto<PostResponseDto[]>> {
    const { blogId, userId, query } = args;

    const postsPromise = this.PostModel.find({ blogId, deletedAt: null })
      .sort(query.getSortOptions())
      .skip(query.calculateSkip())
      .limit(query.pageSize)
      .lean()
      .exec();

    const totalCountPromise = this.PostModel.countDocuments({ blogId, deletedAt: null }).exec();

    const [posts, totalCount] = await Promise.all([postsPromise, totalCountPromise]);

    const postsWithLikeInfo = await this.enrichWithLikes({ posts, userId });

    const items = postsWithLikeInfo.map(post => PostResponseDto.mapToView(post));

    return PaginationResponseDto.mapToViewModel({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findByIdOrThrow(args: { postId: string; userId?: string }): Promise<PostResponseDto> {
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

    return PostResponseDto.mapToView({ postDocument: post, myStatus, newestLikes });
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
