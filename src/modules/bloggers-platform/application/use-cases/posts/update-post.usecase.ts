import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsRepository } from '../../../repository/posts/posts.repository';
import { IUpdatePostDto } from '../../dto/posts/update-post.dto';
import { DomainException, DomainExceptionCode } from 'src/core/exceptions';

export class UpdatePostCommand {
  constructor(public dto: IUpdatePostDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ dto }: UpdatePostCommand): Promise<boolean> {
    const { postId, ...restDto } = dto;

    const post = await this.postsRepository.getById(postId);

    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NOT_FOUND_ERROR,
        message: 'Post not found',
      });
    }

    const updatedPost = post.update(restDto);

    await this.postsRepository.save(updatedPost);

    return true;
  }
}
