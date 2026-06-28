import { BaseDBEntity } from '../../../../core/db';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { LikeStatus } from './dto';
import { CommentEntity } from '../../comments/domain/comment.entity';

@Entity({ name: 'comment_likes' })
@Unique(['userId', 'commentId'])
export class CommentLikeEntity extends BaseDBEntity {
  @Column({ type: 'uuid' })
  commentId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: LikeStatus })
  status: LikeStatus;

  @ManyToOne(() => CommentEntity, comment => comment.likes, {
    onDelete: 'CASCADE', // для удаления связанных сущностей при удалении родительской
  })
  @JoinColumn({ name: 'commentId' })
  comment: CommentEntity;
}
