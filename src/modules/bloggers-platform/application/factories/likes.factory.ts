import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../../domain/likes/like.schema';
import { type LikeModelType } from '../../domain/likes/like.types';
import { ICreateLikeDto } from '../dto/likes/create-like.dto';

@Injectable()
export class LikesFactory {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType
  ) {}

  async createLike(dto: ICreateLikeDto) {
    const newLike = this.LikeModel.createInstance(dto);

    return newLike;
  }
}
