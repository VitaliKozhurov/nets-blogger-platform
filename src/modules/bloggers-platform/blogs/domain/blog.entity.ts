import { BaseDBEntity } from 'src/core/db';
import { Column, Entity, OneToMany } from 'typeorm';
import { PostEntity } from '../../posts/domain/post.entity';

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
}
