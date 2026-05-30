import { NestExpressApplication } from '@nestjs/platform-express';
import { getDataSourceToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { AuthTestUtil } from '../auth/auth.test-util';
import { BlogsTestUtil } from '../blogs/blogs.test-util';
import { clearDatabase } from '../utils/db-tests.utils';
import { initTestApp } from '../utils/init-test-app';
import { PostsTestUtil } from './posts.test-util';

describe('E2E Controller /posts', () => {
  let app: NestExpressApplication;
  let authTestUtils: AuthTestUtil;
  let blogsTestUtils: BlogsTestUtil;
  let postsTestUtils: PostsTestUtil;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await initTestApp();
    dataSource = app.get<DataSource>(getDataSourceToken());
    authTestUtils = new AuthTestUtil(app, dataSource);
    blogsTestUtils = new BlogsTestUtil(app);
    postsTestUtils = new PostsTestUtil(app);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /posts', () => {
    it('should return 200 status code with empty array of posts', async () => {
      const response = await postsTestUtils.getPosts().expect(200);

      const items = response.body.items;

      expect(items).toEqual(expect.any(Array));
      expect(items.length).toBe(0);
    });

    it('should return 200 status code with 1 item in posts array', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();

      const responseBefore = await postsTestUtils.getPosts().expect(200);

      expect(responseBefore.body.items.length).toBe(0);

      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);

      const responseAfter = await postsTestUtils.getPosts().expect(200);

      expect(responseAfter.body.items.length).toBe(1);
      expect(responseAfter.body.items[0]).toEqual(createPostResponse.body);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return 400 status code if postId is incorrect', async () => {
      const response = await postsTestUtils.getPost('fakeId').expect(400);

      expect(response.body.extensions.length).toBe(1);
      const errorField = response.body.extensions[0].field;
      const errorMessage = response.body.extensions[0].message;

      expect(errorField).toBe('uri param');
      expect(errorMessage).toBe('Incorrect uri');
    });

    it('should return 404 status code if post not exist', async () => {
      const fakeId = randomUUID();

      await blogsTestUtils.getBlog(fakeId).expect(404);
    });

    it('should return 200 status code with post data', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);

      const response = await blogsTestUtils.getBlog(createPostResponse.body.id).expect(200);

      expect(response.body).toEqual(createPostResponse.body);
    });
  });

  describe('POST /posts/:postId/posts', () => {
    it('should return 401 status code if accessToken is incorrect', async () => {
      const postId = randomUUID();
      const accessToken = 'fakeAccessToken';

      await postsTestUtils
        .createCommentForPost(postId, accessToken, { content: 'New post content' })
        .expect(401);
    });

    it('should return 400 status code if content is incorrect (not valid)', async () => {
      const postId = randomUUID();
      const { accessToken } = await authTestUtils.loginByRegisteredUser();

      await postsTestUtils
        .createCommentForPost(postId, accessToken, { content: 'Incorrect content' })
        .expect(400);
    });

    it('should return 404 status code if post not exist', async () => {
      const postId = randomUUID();
      const { accessToken } = await authTestUtils.loginByRegisteredUser();

      await postsTestUtils
        .createCommentForPost(postId, accessToken, {
          content: 'New correct content of post comment',
        })
        .expect(404);
    });
  });

  describe('POST /posts/:postId/posts', () => {
    it('should return 401 status code if accessToken is incorrect', async () => {
      const postId = randomUUID();
      const accessToken = 'fakeAccessToken';

      await postsTestUtils
        .createCommentForPost(postId, accessToken, { content: 'New post content' })
        .expect(401);
    });

    it('should return 400 status code if content is incorrect (not valid)', async () => {
      const postId = randomUUID();
      const { accessToken } = await authTestUtils.loginByRegisteredUser();

      await postsTestUtils
        .createCommentForPost(postId, accessToken, { content: 'Incorrect content' })
        .expect(400);
    });

    it('should return 201 status code and created post', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;
      const { accessToken } = await authTestUtils.loginByRegisteredUser();

      const { body } = await postsTestUtils.createCommentForPost(postId, accessToken);

      const likesCount = body.likesInfo.likesCount;
      const dislikesCount = body.likesInfo.dislikesCount;
      const myStatus = body.likesInfo.myStatus;

      expect(likesCount).toBe(0);
      expect(dislikesCount).toBe(0);
      expect(myStatus).toBe('None');
    });
  });
});
