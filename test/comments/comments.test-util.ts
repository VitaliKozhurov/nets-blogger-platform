import { NestExpressApplication } from '@nestjs/platform-express';
import { ICreateCommentDto } from 'src/modules/bloggers-platform/comments';
import request from 'supertest';
import { VALID_BASIC_HEADER } from '../utils/constants';

const COMMENT_POST_DTO = {
  content: 'Comment content',
};

export class CommentsTestUtil {
  constructor(private readonly app: NestExpressApplication) {}

  // createPost(blogId: string, postDto: Partial<ICreateCommentDto> = {}) {
  //   return request(this.app.getHttpServer())
  //     .post(`/posts/${blogId}/posts`)
  //     .set('Authorization', VALID_BASIC_HEADER)
  //     .send({ ...COMMENT_POST_DTO, ...postDto })
  //     .expect(201);
  // }

  // getPosts() {
  //   return request(this.app.getHttpServer()).get('/posts');
  // }

  // getPost(postId: string) {
  //   return request(this.app.getHttpServer()).get(`/posts/${postId}`);
  }
}
