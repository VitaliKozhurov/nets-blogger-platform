import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentLikeEntity } from '../domain/comment-like.entity';
import { LikeStatus } from '../domain/dto';
import { PostLikeEntity } from '../domain/post-like.entity';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostLikeEntity) private postLikesRepo: Repository<PostLikeEntity>,
    @InjectRepository(CommentLikeEntity) private commentLikesRepo: Repository<CommentLikeEntity>
  ) {}

  async updatePostLike(dto: {
    userId: string;
    postId: string;
    likeStatus: LikeStatus;
  }): Promise<boolean> {
    const { userId, postId, likeStatus } = dto;

    const { identifiers } = await this.postLikesRepo
      .createQueryBuilder('pl')
      .insert()
      .values([{ userId, postId, status: likeStatus }])
      .orUpdate(
        ['status'], // Columns to overwrite on conflict
        ['userId', 'postId'] // Conflict target column(s)
      )
      .execute();

    return identifiers.length > 0;
  }

  async updateCommentLike(dto: {
    userId: string;
    commentId: string;
    likeStatus: LikeStatus;
  }): Promise<boolean> {
    const { userId, commentId, likeStatus } = dto;

    const { identifiers } = await this.commentLikesRepo
      .createQueryBuilder('pl')
      .insert()
      .values([{ userId, commentId, status: likeStatus }])
      .orUpdate(
        ['status'], // Columns to overwrite on conflict
        ['userId', 'commentId'] // Conflict target column(s)
      )
      .execute();

    return identifiers.length > 0;
  }
}
