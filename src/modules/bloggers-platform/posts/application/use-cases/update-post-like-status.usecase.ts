import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';
import { LikesRepository } from '@modules/bloggers-platform/likes/repository';
import { LikesFactory } from '@modules/bloggers-platform/likes/application/factories';
import { LikeStatus } from '@modules/bloggers-platform/likes/domain';
import { IUpdatePostLikeStatusDto } from '@modules/bloggers-platform/posts/application/dto';
import { PostsRepository } from '@modules/bloggers-platform/posts/repository';

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
