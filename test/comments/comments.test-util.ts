import { NestExpressApplication } from '@nestjs/platform-express';
import { LikeStatus } from 'src/modules/bloggers-platform/likes/domain/dto';
import request from 'supertest';

const COMMENT_DTO = {
  content: 'Update comment content value dto',
};

export class CommentsTestUtil {
  constructor(private readonly app: NestExpressApplication) {}

  getComment(commentId: string, accessToken?: string) {
    if (accessToken) {
      return request(this.app.getHttpServer())
        .get(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }

    return request(this.app.getHttpServer()).get(`/comments/${commentId}`);
  }

  updateComment(commentId: string, accessToken: string, commentDto = COMMENT_DTO) {
    return request(this.app.getHttpServer())
      .put(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(commentDto);
  }

  updateCommentLikeStatus(commentId: string, accessToken: string, likeStatus: LikeStatus) {
    return request(this.app.getHttpServer())
      .put(`/comments/${commentId}/like-status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ likeStatus });
  }

  deleteComment(commentId: string, accessToken: string) {
    return request(this.app.getHttpServer())
      .delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`);
  }
}
