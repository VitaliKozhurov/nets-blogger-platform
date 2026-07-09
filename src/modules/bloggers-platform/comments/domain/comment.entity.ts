import { UserEntity } from 'src/modules/users-account/users/domain/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseDBEntity } from '../../../../core/db';
import { CommentLikeEntity } from '../../likes/domain/comment-like.entity';
import { PostEntity } from '../../posts/domain/post.entity';
import { ICreateCommentDto } from './dto/create-comment.dto';

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

  @ManyToOne(() => UserEntity, user => user.comment, {
    onDelete: 'CASCADE', // для удаления связанных сущностей при удалении родительской
  })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  static createComment(dto: ICreateCommentDto) {
    const newComment = new CommentEntity();

    newComment.content = dto.content;
    newComment.postId = dto.postId;
    newComment.authorId = dto.userId;

    return newComment;
  }
}
