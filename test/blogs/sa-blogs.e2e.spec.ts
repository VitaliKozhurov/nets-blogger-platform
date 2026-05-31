import { NestExpressApplication } from '@nestjs/platform-express';
import { getDataSourceToken } from '@nestjs/typeorm';
import { clearDatabase } from '../utils/db-tests.utils';
import { initTestApp } from '../utils/init-test-app';
import { DataSource } from 'typeorm';
import { BlogsTestUtil } from './blogs.test-util';
import { PostsTestUtil } from '../posts/posts.test-util';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { randomUUID } from 'crypto';

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
    it('should return 401 status code if not auth headers', async () => {
      await blogsTestUtils.getBlogsForSuperAdmin().expect(401);
    });

    it('should return 200 status with empty blogs array', async () => {
      const response = await blogsTestUtils
        .getBlogsForSuperAdmin()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);

      const items = response.body.items;

      expect(items).toEqual(expect.any(Array));
      expect(items.length).toBe(0);
    });

    it('should return 200 status code with 1 item in blogs array', async () => {
      const responseBefore = await blogsTestUtils
        .getBlogsForSuperAdmin()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);

      expect(responseBefore.body.items.length).toBe(0);

      await blogsTestUtils.createBlog();

      const responseAfter = await blogsTestUtils
        .getBlogs()
        .set('Authorization', VALID_BASIC_HEADER)
        .expect(200);

      expect(responseAfter.body.items.length).toBe(1);
    });
  });

  describe('POST /blogs', () => {
    it('should return 401 status code if not auth headers', async () => {
      await blogsTestUtils.createBlogWithoutHeaders('fakeHeader').expect(401);
    });

    it('should return 400 status code if incorrect body', async () => {
      const response = await blogsTestUtils
        .createBlogWithoutHeaders(VALID_BASIC_HEADER, {
          name: '',
          description: '',
          websiteUrl: '',
        })
        .expect(400);

      expect(response.body.extensions.length).toBe(3);
    });

    it('should return 201 status and create blog', async () => {
      await blogsTestUtils.createBlog();

      const response = await blogsTestUtils.getBlogs();

      const items = response.body.items;

      expect(items.length).toBe(1);
    });
  });

  describe('PUT /blogs/:id', () => {
    it('should return 401 status code if not auth headers', async () => {
      const blogId = randomUUID();

      await blogsTestUtils.updateBlog(blogId, 'fakeHeader').expect(401);
    });

    it('should return 404 status code if blog not exist', async () => {
      const blogId = randomUUID();

      await blogsTestUtils.updateBlog(blogId, VALID_BASIC_HEADER).expect(404);
    });

    it('should return 400 status code if incorrect body', async () => {
      const blogId = randomUUID();
      const response = await blogsTestUtils
        .updateBlog(blogId, VALID_BASIC_HEADER, {
          name: '',
          description: '',
          websiteUrl: '',
        })
        .expect(400);

      expect(response.body.extensions.length).toBe(3);
    });

    it('should return 204 status code and update blog', async () => {
      const response = await blogsTestUtils.createBlog();

      const responseBeforeUpdate = await blogsTestUtils.getBlogs();

      const blogBeforeUpdate = responseBeforeUpdate.body.items[0];

      await blogsTestUtils
        .updateBlog(response.body.id, VALID_BASIC_HEADER, {
          name: 'Updated name',
        })
        .expect(204);

      const responseAfterUpdate = await blogsTestUtils.getBlogs();

      const blogAfterUpdate = responseAfterUpdate.body.items[0];

      expect(blogBeforeUpdate).not.toEqual(blogAfterUpdate);
      expect(blogAfterUpdate.name).toBe('Updated name');
    });
  });

  describe('DELETE /blogs/:id', () => {
    it('should return 401 status code if not auth headers', async () => {
      const blogId = randomUUID();

      await blogsTestUtils.deleteBlog(blogId, 'fakeHeader').expect(401);
    });

    it('should return 404 status code if blog not exist', async () => {
      const blogId = randomUUID();

      await blogsTestUtils.deleteBlog(blogId, VALID_BASIC_HEADER).expect(404);
    });

    it('should return 204 status code if delete existing blog', async () => {
      const response = await blogsTestUtils.createBlog();

      await blogsTestUtils.getBlog(response.body.id).expect(200);

      await blogsTestUtils.deleteBlog(response.body.id, VALID_BASIC_HEADER).expect(204);

      await blogsTestUtils.getBlog(response.body.id).expect(404);
    });
  });
});
