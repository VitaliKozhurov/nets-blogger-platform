import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../repository/comments/comments-query.repository';
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../application/use-cases/comments/delete-comment.usecase';
import { DeleteCommentSwagger } from '../decorators/swagger/comments/delete-comment-swagger.decorator';
import { BearerAuthGuard } from '../../users-account/guards/bearer-auth/bearer-auth.guard';
import { Public } from '../../users-account/guards/public/public.guard';
import { UserFromRequest } from '../../users-account/decorators/user-from-request.decorator';
import { type RequestUserDto } from '../../users-account/application/dto/request-user.dto';
import { UpdateCommentContentRequestDto } from './dto/comments/update-comment-content.dto';
import { UpdateCommentContentCommand } from '../application/use-cases/comments/update-comment-content.usecase';
import { UpdateCommentContentSwagger } from '../decorators/swagger/comments/update-comment-content-swagger.dto';
import { UpdateCommentLikeStatusRequestDto } from './dto/comments/update-comment-like-status.dto';
import { UpdateCommentLikeStatusCommand } from '../application/use-cases/comments/update-comment-like-status.usecase';
import { UpdateCommentLikeStatusSwagger } from '../decorators/swagger/comments/update-comment-like-status-swagger.dto';
import { GetCommentSwagger } from '../decorators/swagger/comments/get-comment-swagger.decorator';

@UseGuards(BearerAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private commentsQueryRepository: CommentsQueryRepository
  ) {}

  @Get(':id')
  @GetCommentSwagger()
  @Public()
  async getById(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.commentsQueryRepository.findByIdOrThrow({ commentId: id });
  }

  @Put(':id')
  @UpdateCommentLikeStatusSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateCommentLikeStatusRequestDto,
    @UserFromRequest() userDto: RequestUserDto
  ) {
    return this.commandBus.execute(
      new UpdateCommentLikeStatusCommand({
        id,
        ...dto,
        ...userDto,
      })
    );
  }

  @Put(':id')
  @UpdateCommentContentSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateContent(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateCommentContentRequestDto,
    @UserFromRequest() userDto: RequestUserDto
  ) {
    return this.commandBus.execute(
      new UpdateCommentContentCommand({
        id,
        ...dto,
        ...userDto,
      })
    );
  }

  @Delete(':id')
  @DeleteCommentSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ObjectIdValidationPipe) id: string,
    @UserFromRequest() dto: RequestUserDto
  ) {
    return this.commandBus.execute(new DeleteCommentCommand({ id, ...dto }));
  }
}
