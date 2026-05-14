import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../../repository';
import { ICreateCommentLikeDto, ICreatePostLikeDto } from '../dto';

@Injectable()
export class LikesFactory {
  constructor(private likeRepository: LikesRepository) {}

  async createCommentLike(dto: ICreateCommentLikeDto) {
    const newLike = this.likeRepository.createCommentLike(dto);

    return newLike;
  }

  async createPostLike(dto: ICreatePostLikeDto) {
    const newLike = this.likeRepository.createPostLike(dto);

    return newLike;
  }
}
