import { LikesFactory } from '@modules/bloggers-platform/likes/application/factories';
import { LikesRepository } from '@modules/bloggers-platform/likes/repository';
import { IUpdatePostLikeStatusDto } from '@modules/bloggers-platform/posts/application/dto';
import { PostsRepository } from '@modules/bloggers-platform/posts/repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

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
    const post = await this.postsRepository.findById(dto.postId);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    await this.likesRepository.upsertPostLike(dto);

    return true;
  }
}
