import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../likes';
import { PostResponseMapperDto } from '../api';
import { IPostRepository } from './dto/post-repository.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findById(postId: string): Promise<IPostRepository | null> {
    const [post]: IPostRepository[] = await this.dataSource.query(
      `
          SELECT *, b."name" as blogName
            FROM posts p
            LEFT JOIN blogs b on p."blogId" = b."id"
            WHERE p."id" = $1 "deletedAt" IS NULL
          `,
      [postId]
    );

    return post || null;
  }

  async create(dto: { title: string; shortDescription: string; content: string; blogId: string }) {
    const { blogId, title, shortDescription, content } = dto;

    const [post]: IPostRepository[] = await this.dataSource.query(
      `
          INSERT INTO "posts" ("blogId", title, "shortDescription", content)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
      [blogId, title, shortDescription, content]
    );

    return post
      ? PostResponseMapperDto.mapToView({ post, myStatus: LikeStatus.None, newestLikes: [] })
      : null;
  }

  async update(dto: {
    blogId: string;
    postId: string;
    title: string;
    shortDescription: string;
    content: string;
  }) {
    const { blogId, postId, title, shortDescription, content } = dto;

    const [post]: { id: string }[] = await this.dataSource.query(
      `
          UPDATE "posts"
            SET title = $3,
                shortDescription = $4,
                content = $5
            WHERE "blogId" = $1 AND "id" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [blogId, postId, title, shortDescription, content]
    );

    return Boolean(post);
  }

  async delete(dto: { blogId: string; postId: string }) {
    const { blogId, postId } = dto;

    const [post]: { id: string }[] = await this.dataSource.query(
      `
          UPDATE "posts"
            SET deletedAt = NOW()
            WHERE "blogId" = $1 AND "id" = $2 AND "deletedAt" IS NULL
            RETURNING id
        `,
      [blogId, postId]
    );

    return Boolean(post);
  }
}
