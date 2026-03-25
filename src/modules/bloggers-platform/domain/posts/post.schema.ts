import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  createdAt: Date;

  @Prop({ type: Number, required: true })
  likesCount: number;

  @Prop({ type: Number, required: true })
  dislikesCount: number;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.method('softDelete', function () {
  if (!this.deletedAt) {
    this.deletedAt = new Date();
  }
});
