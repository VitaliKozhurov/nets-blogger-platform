import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateBlogInstanceDto, UpdateBlogDto } from './blog.dto';

@Schema({ timestamps: true, versionKey: false })
export class Blog {
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  createdAt: Date;

  @Prop({ type: Boolean, required: true, default: false })
  isMembership: boolean;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.virtual('id').get(function () {
  return this._id.toString();
});

BlogSchema.static('createInstance', async function (dto: CreateBlogInstanceDto) {
  const blog = new this();

  blog.name = dto.name;
  blog.description = dto.description;
  blog.websiteUrl = dto.websiteUrl;
  blog.isMembership = false;
  blog.deletedAt = null;

  return blog;
});

BlogSchema.method('softDelete', function () {
  if (!this.deletedAt) {
    this.deletedAt = new Date();
  }
});

BlogSchema.method('update', function (dto: UpdateBlogDto) {
  this.name = dto.name;
  this.description = dto.description;
  this.websiteUrl = dto.websiteUrl;

  return this;
});
