import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../dto/contracts/like.dto';
import { CreateLikeDto } from './like.dto';

@Schema({ timestamps: true, versionKey: false })
export class Like {
  id: string;

  @Prop({ type: String, required: true })
  authorId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  parentId: string;

  createdAt: Date;

  @Prop({ type: String, required: true, enum: LikeStatus, default: LikeStatus.None })
  status: LikeStatus;

  @Prop({ type: Date, nullable: true, default: null })
  addedLikeDate: Date | null;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.static('createInstance', async function (dto: CreateLikeDto) {
  const like = new this();

  like.authorId = dto.authorId;
  like.login = dto.login;
  like.parentId = dto.parentId;
  like.status = dto.likeStatus;
  like.addedLikeDate = new Date();
  like.deletedAt = null;

  return like;
});
