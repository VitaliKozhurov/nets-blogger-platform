import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICommentLikeEntityDto, IPostLikeEntityDto } from '../domain/dto/like-entity.dto';
import { LikeStatus } from '../domain/dto';

@Injectable()
export class LikesRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

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

  async upsertPostLike(dto: {
    userId: string;
    postId: string;
    likeStatus: LikeStatus;
  }): Promise<ICommentLikeEntityDto> {
    const { userId, postId, likeStatus } = dto;

    const [like]: IPostLikeEntityDto[] = await this.dataSource.query(
      `
           INSERT INTO "post_likes" 
            ("userId", "postId", "status")
            VALUES ($1, $2, $3)
            ON CONFLICT ("userId", "postId")
            DO UPDATE SET status = EXCLUDED.status 
            RETURNING *
         `,
      [userId, postId, likeStatus]
    );

    return like;
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
