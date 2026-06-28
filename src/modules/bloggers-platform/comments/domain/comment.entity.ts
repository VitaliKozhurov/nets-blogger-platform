import { BaseDBEntity } from '../../../../core/db';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PostEntity } from '../../posts/domain/post.entity';
import { CommentLikeEntity } from '../../likes/domain/comment-like.entity';

@Entity({ name: 'comments' })
export class CommentEntity extends BaseDBEntity {
  @Column({ type: 'uuid' })
  postId: string;

  @Column('text')
  content: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @OneToMany(() => CommentLikeEntity, like => like.comment, {
    cascade: true, // для сохранения связанных сущностей
  })
  likes: CommentLikeEntity[];

  @ManyToOne(() => PostEntity, post => post.comments, {
    onDelete: 'CASCADE', // для удаления связанных сущностей при удалении родительской
  })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;
}
