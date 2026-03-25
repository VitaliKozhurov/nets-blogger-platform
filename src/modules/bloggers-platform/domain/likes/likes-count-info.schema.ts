import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class LikesCountInfo {
  @Prop({ type: Number, required: true })
  likesCount: number;

  @Prop({ type: Number, required: true })
  dislikesCount: number;
}
