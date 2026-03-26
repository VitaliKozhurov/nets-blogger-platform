import { Inject, Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type PostModelType } from '../../domain/posts/post.types';
import { PostResponseDto } from '../../dto/posts/post-response.dto';
import { PaginationResponseDto } from 'src/core/dto';
import { LikesRepository } from '../likes/likes.repository';
import { LikeStatus } from '../../types/likes/like-status.types';
import { LikeDocument } from '../../domain/likes/like.types';
import { GetPostsByBlogIdQueryParamsDto } from '../../dto/blogs/get-posts-by-blog-id-query-params.dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @Inject() private likesRepository: LikesRepository
  ) {}

  async findAll(): Promise<PaginationResponseDto<PostResponseDto[]>> {
    return {} as PaginationResponseDto<PostResponseDto[]>;
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

    const likesMap = new Map<string, LikeStatus>();
    const newestLikesMap = new Map<string, LikeDocument[]>();

    if (userId && posts.length > 0) {
      const postsIds = posts.map(p => p._id.toString());

      const userLikesPromise = this.likesRepository.getLikesForUser({
        parentIds: postsIds,
        authorId: userId,
      });

      const newestLikesPromise = this.likesRepository.getNewestLikesForParents({
        parentIds: postsIds,
      });

      const [userLikes, newestLikes] = await Promise.all([userLikesPromise, newestLikesPromise]);

      userLikes.forEach(like => likesMap.set(like.parentId, like.status));
      newestLikes.forEach(like => newestLikesMap.set(like._id.toString(), like.newestLikes));
    }

    const items = posts.map(post => {
      const myStatus = userId
        ? (likesMap.get(post._id.toString()) ?? LikeStatus.None)
        : LikeStatus.None;

      return PostResponseDto.mapToView({
        postDocument: post,
        myStatus,
        newestLikes: newestLikesMap.get(post._id.toString()) ?? [],
      });
    });

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
}
