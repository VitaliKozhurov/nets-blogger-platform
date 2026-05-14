import {
  UpdateCommentContentRequestDto,
  UpdateCommentLikeStatusRequestDto,
} from '@modules/bloggers-platform/comments/api/dto';
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
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Public } from 'src/core/guards';
import { ObjectIdValidationPipe, UUIDValidationPipe } from 'src/core/pipes';
import type { RequestUserDto } from 'src/modules/users-account/auth/application/dto/request-user.dto';
import { OptionalUserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/optional-user-from-request.decorator';
import { UseBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-bearer-guard.decorator';
import { UseOptionalBearerGuard } from 'src/modules/users-account/auth/decorators/bearer-auth/use-optional-bearer-guard.decorator';
import { UserFromRequest } from 'src/modules/users-account/auth/decorators/bearer-auth/user-from-request.decorator';

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
    @Param('id', UUIDValidationPipe) id: string,
    @OptionalUserFromRequest() userDto: RequestUserDto | null
  ) {
    const queryCommandDto = {
      commentId: id,
      userId: userDto?.userId ?? undefined,
    };

    return this.commentsQueryRepository.findByIdOrThrow(queryCommandDto);
  }

  @Put(':id')
  @UpdateCommentContentSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateContent(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateCommentContentRequestDto,
    @UserFromRequest() userDto: RequestUserDto
  ) {
    const commandDto = { id, ...dto, ...userDto };

    return this.commandBus.execute(new UpdateCommentContentCommand(commandDto));
  }

  @Put(':id/like-status')
  @UpdateCommentLikeStatusSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateLikeStatus(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateCommentLikeStatusRequestDto,
    @UserFromRequest() userDto: RequestUserDto
  ) {
    const commandDto = { id, ...dto, ...userDto };

    return this.commandBus.execute(new UpdateCommentLikeStatusCommand(commandDto));
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
