import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../../domain/likes/like.schema';
import { LikeDocument, type LikeModelType } from '../../domain/likes/like.types';
import { LikeStatus } from '../../types/likes/like-status.types';
import { Types } from 'mongoose';

const LIKES_LIMIT_COUNT = 3;

type NewestLikesAggregationResult = {
  _id: Types.ObjectId;
  newestLikes: LikeDocument[]
};

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType
  ) {}

  async getLikesForUser(args: { authorId: string; parentIds: string[] }) {
    const { authorId, parentIds } = args;

    return this.LikeModel.find({
      parentId: { $in: parentIds },
      authorId,
    })
      .lean()
      .exec();
  }

  async getMyStatus(args: { parentId: string; authorId: string }) {
    const { parentId, authorId } = args;

    const like = await this.LikeModel.findOne({ parentId, authorId }).lean().exec();

    return like?.status ?? LikeStatus.None;
  }

  async getNewestLikes(args: { parentId: string; limit?: number }) {
    const { parentId, limit = LIKES_LIMIT_COUNT } = args;

    return this.LikeModel.find({ parentId, status: LikeStatus.Like })
      .sort({ addedLikeDate: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async getNewestLikesForParents(args: { parentIds: string[]; limit?: number }) {
    const { parentIds, limit = LIKES_LIMIT_COUNT } = args;

    return this.LikeModel.aggregate<NewestLikesAggregationResult>([
      {
        $match: {
          parentId: { $in: parentIds },
          status: LikeStatus.Like,
        },
      },
      {
        $group: {
          _id: '$parentId',
          newestLikes: {
            $topN: {
              n: limit,
              sortBy: { addedLikeDate: -1 },
              output: '$$ROOT',
            },
          },
        },
      },
    ]);
  }
}
