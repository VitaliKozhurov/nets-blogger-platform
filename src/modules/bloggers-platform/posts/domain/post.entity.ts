import { BaseDBEntity } from 'src/core/db';
import { Column, Entity, JoinColumn } from 'typeorm';
import { ManyToOne } from 'typeorm/browser';
import { BlogEntity } from '../../blogs/domain/blog.entity';

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
}
