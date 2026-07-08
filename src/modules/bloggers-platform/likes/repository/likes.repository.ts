import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentLikeEntity } from '../domain/comment-like.entity';
import { LikeStatus } from '../domain/dto';
import { ICommentLikeEntityDto, IPostLikeEntityDto } from '../domain/dto/like-entity.dto';
import { PostLikeEntity } from '../domain/post-like.entity';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostLikeEntity) private postLikesRepo: Repository<PostLikeEntity>,
    @InjectRepository(CommentLikeEntity) private commentLikesRepo: Repository<CommentLikeEntity>
  ) {}

  async getPostLike(args: { userId: string; postId: string }) {
    const { userId, postId } = args;

    const [like]: IPostLikeEntityDto[] = await this.dataSource.query(
      `
          SELECT *
            FROM "post_likes" 
            WHERE "userId" = $1 AND "postId" = $2
         `,
      [userId, postId]
    );

    return like;
  }

  async createPostLike(dto: {
    userId: string;
    postId: string;
    likeStatus: LikeStatus;
  }): Promise<IPostLikeEntityDto> {
    const { userId, postId, likeStatus } = dto;

    const [like]: IPostLikeEntityDto[] = await this.dataSource.query(
      `
           INSERT INTO "post_likes" 
            ("userId", "postId", "status")
             VALUES ($1, $2, $3)
             RETURNING *
         `,
      [userId, postId, likeStatus]
    );

    return like;
  }

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

  async getCommentLike(args: { userId: string; commentId: string }) {
    const { userId, commentId } = args;

    const [like]: IPostLikeEntityDto[] = await this.dataSource.query(
      `
          SELECT *
            FROM "comment_likes" 
            WHERE "userId" = $1 AND "commentId" = $2
         `,
      [userId, commentId]
    );

    return like;
  }

  async createCommentLike(dto: {
    userId: string;
    commentId: string;
    likeStatus: LikeStatus;
  }): Promise<ICommentLikeEntityDto> {
    const { userId, commentId, likeStatus } = dto;

    const [like]: ICommentLikeEntityDto[] = await this.dataSource.query(
      `
           INSERT INTO "comment_likes" 
              ("userId", "commentId", "status")
              VALUES ($1, $2, $3)
              RETURNING *
         `,
      [userId, commentId, likeStatus]
    );

    return like;
  }

  async upsertCommentLike(dto: {
    userId: string;
    commentId: string;
    likeStatus: LikeStatus;
  }): Promise<ICommentLikeEntityDto> {
    const { userId, commentId, likeStatus } = dto;

    const [like]: ICommentLikeEntityDto[] = await this.dataSource.query(
      `
           INSERT INTO "comment_likes" 
            ("userId", "commentId", "status")
            VALUES ($1, $2, $3)
            ON CONFLICT ("userId", "commentId")
            DO UPDATE SET status = EXCLUDED.status 
            RETURNING *
         `,
      [userId, commentId, likeStatus]
    );

    return like;
  }
}
