import { LikeDocument, LikeStatus } from '@modules/bloggers-platform/likes/domain';
import { IPostRepository } from '../../repository';
import { IPostViewDto } from './post-view.dto';

export class PostResponseMapperDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: { addedAt: string; userId: string; login: string }[];
  };

  static mapToView(args: {
    post: IPostRepository;
    myStatus: LikeStatus;
    newestLikes: LikeDocument[];
  }): IPostViewDto {
    const dto = new PostResponseMapperDto();
    const { post, myStatus } = args;

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();

    dto.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: myStatus,
      newestLikes: [],
    };
    console.log(dto);

    return dto;
  }
}
