import { NestExpressApplication } from '@nestjs/platform-express';
import { getDataSourceToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { AuthTestUtil } from '../auth/auth.test-util';
import { BlogsTestUtil } from '../blogs/blogs.test-util';
import { clearDatabase } from '../utils/db-tests.utils';
import { initTestApp } from '../utils/init-test-app';
import { PostsTestUtil } from './posts.test-util';
import { UsersTestUtil } from '../users/users.test-util';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';
import { AppThrottleGuard } from 'src/core/guards';

describe('E2E Controller /posts', () => {
  let app: NestExpressApplication;
  let authTestUtils: AuthTestUtil;
  let usersTestUtil: UsersTestUtil;
  let blogsTestUtils: BlogsTestUtil;
  let postsTestUtils: PostsTestUtil;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await initTestApp(builder => {
      return builder.overrideGuard(AppThrottleGuard).useValue({
        canActivate: () => true,
      });
    });
    dataSource = app.get<DataSource>(getDataSourceToken());
    authTestUtils = new AuthTestUtil(app, dataSource);
    usersTestUtil = new UsersTestUtil(app);
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

      const response = await postsTestUtils.getPost(createPostResponse.body.id).expect(200);

      expect(response.body).toEqual(createPostResponse.body);
    });
  });

  describe('POST /posts/:postId/comments', () => {
    it('should return 401 status code if accessToken is incorrect', async () => {
      const postId = randomUUID();
      const accessToken = 'fakeAccessToken';

      await postsTestUtils.createCommentForPost(postId, accessToken).expect(401);
    });

    it('should return 400 status code if content is incorrect (not valid)', async () => {
      const postId = randomUUID();

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await postsTestUtils
        .createCommentForPost(postId, accessToken, { content: 'Incorrect content' })
        .expect(400);
    });

    it('should return 404 status code if post not exist', async () => {
      const postId = randomUUID();

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await postsTestUtils
        .createCommentForPost(postId, accessToken, {
          content: 'New correct content of post comment',
        })
        .expect(404);
    });

    it('should return 201 status code and created post', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const { body } = await postsTestUtils.createCommentForPost(postId, accessToken).expect(201);

      const likesCount = body.likesInfo.likesCount;
      const dislikesCount = body.likesInfo.dislikesCount;
      const myStatus = body.likesInfo.myStatus;

      expect(likesCount).toBe(0);
      expect(dislikesCount).toBe(0);
      expect(myStatus).toBe('None');
    });
  });

  describe('GET /posts/:postId/comments', () => {
    it('should return 400 status code if content is incorrect (not valid)', async () => {
      const postId = 'fakePostId';

      await postsTestUtils.getCommentsByPost(postId).expect(400);
    });

    it('should return 404 status code if post not exist', async () => {
      const postId = randomUUID();

      await postsTestUtils.getCommentsByPost(postId).expect(404);
    });

    it('should return 200 status code and array of comments', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const { body } = await postsTestUtils.createCommentForPost(postId, accessToken).expect(201);

      const commentsResponse = await postsTestUtils.getCommentsByPost(postId).expect(200);

      expect(commentsResponse.body.items.length).toBe(1);
      expect(commentsResponse.body.items[0]).toEqual(body);
    });
  });

  describe('PUT /posts/:postId/like-status', () => {
    it('should return 401 status code if accessToken is incorrect (not valid)', async () => {
      const postId = 'fakePostId';
      const fakeAccessToke = 'fakeAccessToke';

      await postsTestUtils
        .updatePostLikeStatus(postId, fakeAccessToke, LikeStatus.Like)
        .expect(401);
    });

    it('should return 400 status code if post not exist', async () => {
      const postId = 'fakeId';

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await postsTestUtils.updatePostLikeStatus(postId, accessToken, LikeStatus.Like).expect(400);
    });

    it('should return 404 status code if post not exist', async () => {
      const postId = randomUUID();

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await postsTestUtils.updatePostLikeStatus(postId, accessToken, LikeStatus.Like).expect(404);
    });

    it('should return 400 status code if send incorrect like status', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const {
        body: { extensions },
      } = await postsTestUtils
        .updatePostLikeStatus(postId, accessToken, 'fakeStatus' as LikeStatus)
        .expect(400);

      expect(extensions[0].field).toBe('likeStatus');
    });

    it('should return 204 status code and change like', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const postsBeforeUpdate = await postsTestUtils.getPost(postId);

      expect(postsBeforeUpdate.body.extendedLikesInfo.likesCount).toBe(0);

      await postsTestUtils.updatePostLikeStatus(postId, accessToken, LikeStatus.Like).expect(204);

      const postsAfterUpdate = await postsTestUtils.getPost(postId);

      expect(postsAfterUpdate.body.extendedLikesInfo.likesCount).toBe(1);
    });
  });
});
