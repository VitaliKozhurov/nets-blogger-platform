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
});
