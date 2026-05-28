import { NestExpressApplication } from '@nestjs/platform-express';
import { getDataSourceToken } from '@nestjs/typeorm';
import { clearDatabase } from '../utils/db-tests.utils';
import { initTestApp } from '../utils/init-test-app';
import { DataSource } from 'typeorm';
import { BlogsTestUtil } from './blogs.test-util';
import { randomUUID } from 'crypto';
import { IBlogViewDto } from 'src/modules/bloggers-platform/blogs/application/dto/blog.mapper';
import { PostsTestUtil } from '../posts/posts.test-util';

describe('E2E Controller /blogs', () => {
  let app: NestExpressApplication;
  let blogsTestUtils: BlogsTestUtil;
  let postsTestUtils: PostsTestUtil;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await initTestApp();
    blogsTestUtils = new BlogsTestUtil(app);
    postsTestUtils = new PostsTestUtil(app);
    dataSource = app.get<DataSource>(getDataSourceToken());
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /blogs', () => {
    it('should return 200 status code with empty array of blogs', async () => {
      const response = await blogsTestUtils.getBlogs().expect(200);

      const items = response.body.items;

      expect(items).toEqual(expect.any(Array));
      expect(items.length).toBe(0);
    });

    it('should return 200 status code with 1 item in blogs array', async () => {
      const responseBefore = await blogsTestUtils.getBlogs().expect(200);

      expect(responseBefore.body.items.length).toBe(0);

      await blogsTestUtils.createBlog();

      const responseAfter = await blogsTestUtils.getBlogs().expect(200);

      expect(responseAfter.body.items.length).toBe(1);
    });
  });

  describe('GET /blogs/:id', () => {
    it('should return 400 status code if blogId is incorrect', async () => {
      const response = await blogsTestUtils.getBlog('fakeId').expect(400);

      expect(response.body.extensions.length).toBe(1);
      const errorField = response.body.extensions[0].field;
      const errorMessage = response.body.extensions[0].message;

      expect(errorField).toBe('uri param');
      expect(errorMessage).toBe('Incorrect uri');
    });

    it('should return 404 status code if blog not exist', async () => {
      const fakeId = randomUUID();

      await blogsTestUtils.getBlog(fakeId).expect(404);
    });

    it('should return 200 status code with blog data', async () => {
      const { body } = await blogsTestUtils.createBlog();
      const createdBlog: IBlogViewDto = body;

      const response = await blogsTestUtils.getBlog(createdBlog.id).expect(200);

      expect(response.body).toEqual(createdBlog);
    });
  });

  describe('GET /blogs/posts', () => {
    it('should return 400 status code if blogId is incorrect', async () => {
      const response = await blogsTestUtils.getBlogPosts('fakeId').expect(400);

      expect(response.body.extensions.length).toBe(1);
      const errorField = response.body.extensions[0].field;
      const errorMessage = response.body.extensions[0].message;

      expect(errorField).toBe('uri param');
      expect(errorMessage).toBe('Incorrect uri');
    });

    it('should return 404 status code if blog not exist', async () => {
      const fakeId = randomUUID();

      await blogsTestUtils.getBlogPosts(fakeId).expect(404);
    });

    it('should return 200 status code with array of posts with', async () => {
      const { body } = await blogsTestUtils.createBlog();
      const createdBlog: IBlogViewDto = body;

      const responseBefore = await blogsTestUtils.getBlogPosts(createdBlog.id).expect(200);

      expect(responseBefore.body.items.length).toBe(0);

      const { body: createdPost } = await postsTestUtils.createPost(createdBlog.id);

      const responseAfter = await blogsTestUtils.getBlogPosts(createdBlog.id).expect(200);

      expect(responseAfter.body.items.length).toBe(1);
      expect(responseAfter.body.items[0]).toEqual(createdPost);
    });
  });
});
