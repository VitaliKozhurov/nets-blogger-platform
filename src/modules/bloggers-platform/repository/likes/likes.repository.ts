import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../../domain/likes/like.schema';
import { type LikeModelType } from '../../domain/likes/like.types';
import { LikeStatus } from '../../types/likes/like-status.types';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType
  ) {}

  async getMyStatus(args: { parentId: string; authorId?: string }) {
    const { parentId, authorId } = args;

    if (!authorId) {
      return LikeStatus.None;
    }

    const like = await this.LikeModel.findOne({ parentId, authorId }).lean().exec();

    return like?.status ?? LikeStatus.None;
  }
}
