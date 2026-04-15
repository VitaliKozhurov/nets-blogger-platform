import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { LikesRepository } from '../../../repository/likes/likes.repository';
import { LikesFactory } from '../../factories/likes.factory';
import { LikeStatus } from '../../../domain/likes/like.dto';
import { IUpdatePostLikeStatusDto } from '../../dto/posts/update-post-like-status.dto';
import { PostsRepository } from 'src/modules/bloggers-platform/repository/posts/posts.repository';

export class UpdatePostLikeStatusCommand {
  constructor(public dto: IUpdatePostLikeStatusDto) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase implements ICommandHandler<UpdatePostLikeStatusCommand> {
  constructor(
    private likesFactory: LikesFactory,
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository
  ) {}

  async execute({ dto }: UpdatePostLikeStatusCommand): Promise<boolean> {
    const { id, likeStatus, userId: authorId, login } = dto;

    const post = await this.postsRepository.getById(id);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    const parentId = post._id.toString();

    const like = await this.likesRepository.getLikeByAuthorId({
      parentId,
      authorId,
    });

    if (!like) {
      if (likeStatus === LikeStatus.None) {
        return true;
      }

      const currentLike = await this.likesFactory.createLike({
        authorId,
        login,
        parentId,
        likeStatus,
      });

      post.applyIncomingLikeStatus(likeStatus);

      await this.likesRepository.save(currentLike);
      await this.postsRepository.save(post);

      return true;
    }

    post.updateLikesInfo({
      currentLike: like,
      nextLikeStatus: likeStatus,
    });

    like.updateLikeStatus(likeStatus);

    await this.likesRepository.save(like);
    await this.postsRepository.save(post);

    return true;
  }
}
