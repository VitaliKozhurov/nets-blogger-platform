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
import { CommandBus } from '@nestjs/cqrs';
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { type RequestUserDto } from 'src/modules/users-account/contracts';
import { UserFromRequest } from 'src/modules/users-account/decorators';
import { BearerAuthGuard, Public } from 'src/modules/users-account/guards';
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
