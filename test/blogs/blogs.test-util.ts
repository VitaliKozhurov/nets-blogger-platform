import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { ICreateBlogDto } from 'src/modules/bloggers-platform/blogs';
import { VALID_BASIC_HEADER } from '../utils/constants';

const TEST_BLOG_DTO = {
  name: 'New blog',
  description: 'New blog description',
  websiteUrl: 'https://my-site.io',
};

export class BlogsTestUtil {
  constructor(private readonly app: NestExpressApplication) {}

  createBlog(blogDto: Partial<ICreateBlogDto> = {}) {
    return request(this.app.getHttpServer())
      .post('/sa/blogs')
      .set('Authorization', VALID_BASIC_HEADER)
      .send({ ...TEST_BLOG_DTO, ...blogDto })
      .expect(201);
  }

  deleteBlog(blogId: string) {
    return request(this.app.getHttpServer()).delete(`/sa/blogs/${blogId}`);
  }

  getBlogs() {
    return request(this.app.getHttpServer()).get('/blogs');
  }

  getBlog(blogId: string) {
    return request(this.app.getHttpServer()).get(`/blogs/${blogId}`);
  }

  getBlogPosts(blogId: string) {
    return request(this.app.getHttpServer()).get(`/blogs/${blogId}/posts`);
  }
}
