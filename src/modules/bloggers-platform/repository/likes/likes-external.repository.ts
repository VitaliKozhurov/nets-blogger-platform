import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../../domain/likes/like.schema';
import { type LikeModelType } from '../../domain/likes/like.types';

@Injectable()
export class LikesExternalRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType
  ) {}

  async delete() {
    await this.LikeModel.deleteMany();
  }
}
