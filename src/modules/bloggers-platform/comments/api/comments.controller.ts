import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from 'src/core/pipes';
import {
  DeleteCommentCommand,
  UpdateCommentContentCommand,
  UpdateCommentLikeStatusCommand,
} from '@modules/bloggers-platform/comments/application/use-cases';
import {
  DeleteCommentSwagger,
  GetCommentSwagger,
  UpdateCommentContentSwagger,
  UpdateCommentLikeStatusSwagger,
} from '@modules/bloggers-platform/comments/decorators/swagger';
import { CommentsQueryRepository } from '@modules/bloggers-platform/comments/repository';
import {
  UpdateCommentContentRequestDto,
  UpdateCommentLikeStatusRequestDto,
} from '@modules/bloggers-platform/comments/api/dto';
import {
  OptionalUserFromRequest,
  type RequestUserDto,
  UseBearerGuard,
  UseOptionalBearerGuard,
  UserFromRequest,
} from 'src/modules/users-account/auth';
import { Public } from 'src/core/guards';

@Controller('comments')
@UseBearerGuard()
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private commentsQueryRepository: CommentsQueryRepository
  ) {}

  @Get(':id')
  @GetCommentSwagger()
  @UseOptionalBearerGuard()
  @Public()
  async getById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    return this.commentsQueryRepository.findByIdOrThrow({
      commentId: id,
      userId: userDto?.userId ?? undefined,
    });
  }

  @Put(':id/like-status')
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
