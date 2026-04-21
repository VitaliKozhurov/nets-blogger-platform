import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from '../../domain';
import { type LikeModelType } from '../../domain';
import { ICreateLikeDto } from '../dto/create-like.dto';

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
