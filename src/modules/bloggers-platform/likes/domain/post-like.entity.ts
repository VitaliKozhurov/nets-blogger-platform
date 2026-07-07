import { UserEntity } from 'src/modules/users-account/users/domain/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseDBEntity } from '../../../../core/db';
import { PostEntity } from '../../posts/domain/post.entity';
import { LikeStatus } from './dto';

@Entity({ name: 'post_likes' })
@Unique(['userId', 'postId'])
export class PostLikeEntity extends BaseDBEntity {
  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: LikeStatus })
  status: LikeStatus;

  @ManyToOne(() => PostEntity, post => post.likes, {
    onDelete: 'CASCADE', // для удаления связанных сущностей при удалении родительской
  })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, user => user.postLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
