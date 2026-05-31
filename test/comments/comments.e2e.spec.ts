import { NestExpressApplication } from '@nestjs/platform-express';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AppThrottleGuard } from 'src/core/guards';
import { AuthTestUtil } from '../auth/auth.test-util';
import { BlogsTestUtil } from '../blogs/blogs.test-util';
import { PostsTestUtil } from '../posts/posts.test-util';
import { UsersTestUtil } from '../users/users.test-util';
import { clearDatabase } from '../utils/db-tests.utils';
import { initTestApp } from '../utils/init-test-app';
import { DataSource } from 'typeorm';
import { CommentsTestUtil } from './comments.test-util';
import { randomUUID } from 'crypto';
import { VALID_BASIC_HEADER } from '../utils/constants';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';

describe('E2E Controller /posts', () => {
  let app: NestExpressApplication;
  let authTestUtils: AuthTestUtil;
  let usersTestUtil: UsersTestUtil;
  let blogsTestUtils: BlogsTestUtil;
  let postsTestUtils: PostsTestUtil;
  let commentsTestUtils: CommentsTestUtil;
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
    commentsTestUtils = new CommentsTestUtil(app);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /comments/:id', () => {
    it('should return 400 status code if comment id is incorrect', async () => {
      const fakeCommentId = 'fakeId';

      await commentsTestUtils.getComment(fakeCommentId).expect(400);
    });

    it('should return 404 status code if comment not exist', async () => {
      const fakeCommentId = randomUUID();

      await commentsTestUtils.getComment(fakeCommentId).expect(404);
    });

    it('should return 200 status code with comment response', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const postId = createPostResponse.body.id;

      const createCommentResponse = await postsTestUtils
        .createCommentForPost(postId, accessToken)
        .expect(201);

      const response = await commentsTestUtils
        .getComment(createCommentResponse.body.id)
        .expect(200);

      expect(response.body).toEqual(createCommentResponse.body);
    });
  });

  describe('DELETE /comments/:id', () => {
    it('should return 400 status code if comment id is incorrect', async () => {
      const fakeCommentId = 'fakeId';

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await commentsTestUtils.deleteComment(fakeCommentId, accessToken).expect(400);
    });

    it('should return 404 status code if comment not exist', async () => {
      const fakeCommentId = randomUUID();

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await commentsTestUtils.deleteComment(fakeCommentId, accessToken).expect(404);
    });

    it('should return 401 status code if access token is not correct', async () => {
      const fakeCommentId = randomUUID();
      const fakeAccessToken = 'fakeToken';

      await commentsTestUtils.deleteComment(fakeCommentId, fakeAccessToken).expect(401);
    });

    it('should return 403 status code if try delete other user comment', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const createCommentResponse = await postsTestUtils
        .createCommentForPost(postId, accessToken)
        .expect(201);

      await usersTestUtil
        .createUser({
          login: 'login2',
          password: 'password2',
          email: 'example2@gmail.com',
        })
        .set('Authorization', VALID_BASIC_HEADER);
      const loginOtherUserResponse = await authTestUtils.login('login2', 'password2');

      await commentsTestUtils
        .deleteComment(createCommentResponse.body.id, loginOtherUserResponse.body.accessToken)
        .expect(403);
    });

    it('should return 204 status code and remove comment', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const createCommentResponse = await postsTestUtils
        .createCommentForPost(postId, accessToken)
        .expect(201);

      await commentsTestUtils.getComment(createCommentResponse.body.id).expect(200);

      await commentsTestUtils.deleteComment(createCommentResponse.body.id, accessToken).expect(204);

      await commentsTestUtils.getComment(createCommentResponse.body.id).expect(404);
    });
  });

  describe('PUT /comments/:id', () => {
    it('should return 400 status code if comment id is incorrect', async () => {
      const fakeCommentId = 'fakeId';

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await commentsTestUtils.updateComment(fakeCommentId, accessToken).expect(400);
    });

    it('should return 404 status code if comment not exist', async () => {
      const fakeCommentId = randomUUID();

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await commentsTestUtils.updateComment(fakeCommentId, accessToken).expect(404);
    });

    it('should return 401 status code if access token is not correct', async () => {
      const fakeCommentId = randomUUID();
      const fakeAccessToken = 'fakeToken';

      await commentsTestUtils.updateComment(fakeCommentId, fakeAccessToken).expect(401);
    });

    it('should return 403 status code if try update other user comment', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const createCommentResponse = await postsTestUtils
        .createCommentForPost(postId, accessToken)
        .expect(201);

      await usersTestUtil
        .createUser({
          login: 'login2',
          password: 'password2',
          email: 'example2@gmail.com',
        })
        .set('Authorization', VALID_BASIC_HEADER);
      const loginOtherUserResponse = await authTestUtils.login('login2', 'password2');

      await commentsTestUtils
        .updateComment(createCommentResponse.body.id, loginOtherUserResponse.body.accessToken)
        .expect(403);
    });

    it('should return 204 status code and update comment', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const createCommentResponse = await postsTestUtils
        .createCommentForPost(postId, accessToken)
        .expect(201);

      await commentsTestUtils.getComment(createCommentResponse.body.id).expect(200);

      await commentsTestUtils.updateComment(createCommentResponse.body.id, accessToken).expect(204);

      const getCommentResponse = await commentsTestUtils
        .getComment(createCommentResponse.body.id)
        .expect(200);

      expect(createCommentResponse.body).not.toEqual(getCommentResponse.body);
    });
  });

  describe('PUT /comments/:id/like-status', () => {
    it('should return 400 status code if comment id is incorrect', async () => {
      const fakeCommentId = 'fakeId';

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await commentsTestUtils
        .updateCommentLikeStatus(fakeCommentId, accessToken, LikeStatus.Like)
        .expect(400);
    });

    it('should return 404 status code if comment not exist', async () => {
      const fakeCommentId = randomUUID();

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      await commentsTestUtils
        .updateCommentLikeStatus(fakeCommentId, accessToken, LikeStatus.Like)
        .expect(404);
    });

    it('should return 401 status code if access token is not correct', async () => {
      const fakeCommentId = randomUUID();
      const fakeAccessToken = 'fakeToken';

      await commentsTestUtils
        .updateCommentLikeStatus(fakeCommentId, fakeAccessToken, LikeStatus.Like)
        .expect(401);
    });

    it('should return 204 status code and update comment like status', async () => {
      const createBlogResponse = await blogsTestUtils.createBlog();
      const createPostResponse = await postsTestUtils.createPost(createBlogResponse.body.id);
      const postId = createPostResponse.body.id;

      await usersTestUtil.createUser().set('Authorization', VALID_BASIC_HEADER);
      const {
        body: { accessToken },
      } = await authTestUtils.login('login', 'password');

      const createCommentResponse = await postsTestUtils
        .createCommentForPost(postId, accessToken)
        .expect(201);

      await commentsTestUtils.getComment(createCommentResponse.body.id).expect(200);

      await commentsTestUtils
        .updateCommentLikeStatus(createCommentResponse.body.id, accessToken, LikeStatus.Like)
        .expect(204);

      const getCommentResponse = await commentsTestUtils
        .getComment(createCommentResponse.body.id, accessToken)
        .expect(200);

      expect(getCommentResponse.body.likesInfo.myStatus).toBe(LikeStatus.Like);
    });
  });
});
