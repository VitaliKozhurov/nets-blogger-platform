import { BaseDBEntity } from '../../../../core/db';
import { Column, Entity, OneToMany } from 'typeorm';
import { PostEntity } from '../../posts/domain/post.entity';
import { ICreateBlogDto } from './dto/create-blog.dto';

@Entity({ name: 'blogs' })
export class BlogEntity extends BaseDBEntity {
  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  websiteUrl: string;

  @Column('boolean')
  isMembership: boolean;

  @OneToMany(() => PostEntity, post => post.blog, {
    cascade: true, // для сохранения связанных сущностей
  })
  posts: PostEntity[];

  static createBlog(dto: ICreateBlogDto) {
    const newBlog = new BlogEntity();

    newBlog.name = dto.name;
    newBlog.description = dto.description;
    newBlog.websiteUrl = dto.websiteUrl;
    newBlog.isMembership = false;

    return newBlog;
  }
}
