import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { ICreatePostDto } from 'src/modules/bloggers-platform/posts';

const TEST_POST_DTO = {
  title: 'New post',
  shortDescription: 'New post short description',
  content: 'New post content',
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
}
