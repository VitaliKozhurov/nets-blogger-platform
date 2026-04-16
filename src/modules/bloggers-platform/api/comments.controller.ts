import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { type RequestUserDto } from 'src/modules/users-account/contracts';
import {
  OptionalUserFromRequest,
  UseBearerGuard,
  UseOptionalBearerGuard,
  UserFromRequest,
} from 'src/modules/users-account/decorators';
import { Public } from 'src/modules/users-account/guards';
import {
  DeleteCommentCommand,
  UpdateCommentContentCommand,
  UpdateCommentLikeStatusCommand,
} from '../application/use-cases';
import {
  DeleteCommentSwagger,
  GetCommentSwagger,
  UpdateCommentContentSwagger,
  UpdateCommentLikeStatusSwagger,
} from '../decorators/swagger';
import { CommentsQueryRepository } from '../repository';
import { UpdateCommentContentRequestDto, UpdateCommentLikeStatusRequestDto } from './dto';

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
