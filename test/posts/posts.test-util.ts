import { NestExpressApplication } from '@nestjs/platform-express';
import { ICreateCommentDto } from 'src/modules/bloggers-platform/comments';
import { ICreatePostDto } from 'src/modules/bloggers-platform/posts';
import request from 'supertest';
import { VALID_BASIC_HEADER } from '../utils/constants';

const TEST_POST_DTO = {
  title: 'New post',
  shortDescription: 'New post short description',
  content: 'New post content',
};

const TEST_COMMENT_DTO = {
  content: 'New valid comment content',
};

export class PostsTestUtil {
  constructor(private readonly app: NestExpressApplication) {}

  createPost(blogId: string, postDto: Partial<ICreatePostDto> = {}) {
    return request(this.app.getHttpServer())
      .post(`/sa/blogs/${blogId}/posts`)
      .set('Authorization', VALID_BASIC_HEADER)
      .send({ ...TEST_POST_DTO, ...postDto })
      .expect(201);
  }

  getPosts() {
    return request(this.app.getHttpServer()).get('/posts');
  }

  getPost(postId: string) {
    return request(this.app.getHttpServer()).get(`/posts/${postId}`);
  }

  createCommentForPost(
    postId: string,
    accessToken: string,
    commentDto?: Partial<ICreateCommentDto>
  ) {
    return request(this.app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...TEST_COMMENT_DTO, ...commentDto })
      .expect(201);
  }
}
