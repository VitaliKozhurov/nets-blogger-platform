import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { ICreateBlogDto, IUpdateBlogDto } from 'src/modules/bloggers-platform/blogs';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { ICreatePostDto, IUpdatePostDto } from 'src/modules/bloggers-platform/posts';

const TEST_BLOG_DTO = {
  name: 'New blog',
  description: 'New blog description',
  websiteUrl: 'https://my-site.io',
};

const TEST_POST_DTO = {
  title: 'New post',
  shortDescription: 'New post short description',
  content: 'New post content',
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

  createBlogWithoutHeaders(header: string, blogDto: Partial<ICreateBlogDto> = {}) {
    return request(this.app.getHttpServer())
      .post('/sa/blogs')
      .set('Authorization', header)
      .send({ ...TEST_BLOG_DTO, ...blogDto });
  }

  updateBlog(blogId: string, header: string, blogDto: Partial<IUpdateBlogDto> = {}) {
    return request(this.app.getHttpServer())
      .put(`/sa/blogs/${blogId}`)
      .set('Authorization', header)
      .send({ ...TEST_BLOG_DTO, ...blogDto });
  }

  deleteBlog(blogId: string, header: string) {
    return request(this.app.getHttpServer())
      .delete(`/sa/blogs/${blogId}`)
      .set('Authorization', header);
  }

  createPostForBlog(
    blogId: string,
    header: string,
    postDto: Partial<Omit<ICreatePostDto, 'blogId'>> = {}
  ) {
    return request(this.app.getHttpServer())
      .post(`/sa/blogs/${blogId}/posts`)
      .set('Authorization', header)
      .send({ ...TEST_POST_DTO, ...postDto });
  }

  updatePostForBlog(
    blogId: string,
    postId: string,
    header: string,
    postDto: Partial<IUpdatePostDto> = {}
  ) {
    return request(this.app.getHttpServer())
      .put(`/sa/blogs/${blogId}/posts/${postId}`)
      .set('Authorization', header)
      .send({ ...TEST_POST_DTO, ...postDto });
  }

  deletePostForBlog(blogId: string, postId: string, header: string) {
    return request(this.app.getHttpServer())
      .delete(`/sa/blogs/${blogId}/posts/${postId}`)
      .set('Authorization', header);
  }

  getPostsForBlog(blogId: string, header: string) {
    return request(this.app.getHttpServer())
      .get(`/sa/blogs/${blogId}/posts`)
      .set('Authorization', header);
  }

  getBlogs() {
    return request(this.app.getHttpServer()).get('/blogs');
  }

  getBlogsForSuperAdmin() {
    return request(this.app.getHttpServer()).get('/sa/blogs');
  }

  getBlog(blogId: string) {
    return request(this.app.getHttpServer()).get(`/blogs/${blogId}`);
  }

  getBlogPosts(blogId: string) {
    return request(this.app.getHttpServer()).get(`/blogs/${blogId}/posts`);
  }
}
