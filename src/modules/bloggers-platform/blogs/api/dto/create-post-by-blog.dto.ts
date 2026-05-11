import { OmitType } from '@nestjs/swagger';
import { CreatePostRequestDto } from 'src/modules/bloggers-platform/posts';

export class CreatePostByBlogRequestDto extends OmitType(CreatePostRequestDto, ['blogId']) {}
