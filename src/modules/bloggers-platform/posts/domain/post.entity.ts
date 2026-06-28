import { BaseDBEntity } from 'src/core/db';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BlogEntity } from '../../blogs/domain/blog.entity';
import { ICreatePostDto } from './dto/create-post.dto';

@Entity({ name: 'posts' })
export class PostEntity extends BaseDBEntity {
  @Column({ type: 'uuid' })
  blogId: string;

  @Column('text')
  title: string;

  @Column('text')
  shortDescription: string;

  @Column('text')
  content: string;

  @ManyToOne(() => BlogEntity, blog => blog.posts, {
    onDelete: 'CASCADE', // для удаления связанных сущностей при удалении родительской
  })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;

  static createPost(dto: ICreatePostDto) {
    const newPost = new PostEntity();

    newPost.blogId = dto.blogId;
    newPost.title = dto.title;
    newPost.content = dto.content;
    newPost.shortDescription = dto.shortDescription;

    return newPost;
  }
}
