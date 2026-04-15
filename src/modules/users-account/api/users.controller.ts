import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBasicAuth } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { CreateUserByAdminCommand, DeleteUserByAdminCommand } from '../application/use-cases';
import {
  CreateUserByAdminSwagger,
  DeleteUserSwagger,
  GetUsersSwagger,
} from '../decorators/swagger';
import { UsersQueryRepository } from '../infrastructure';
import { CreateUserByAdminRequestDto, GetUsersQueryDto } from './dto';
import { UseBasicGuard } from '../decorators';

// @UseGuards(BasicAuthGuard)
@Controller('users')
@UseBasicGuard()
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: UsersQueryRepository
  ) {}

  @Get()
  @GetUsersSwagger()
  async findAll(@Query() query: GetUsersQueryDto) {
    return this.usersQueryRepository.findAll(query);
  }

  @Post()
  @CreateUserByAdminSwagger()
  async create(@Body() dto: CreateUserByAdminRequestDto) {
    const userId = await this.commandBus.execute<CreateUserByAdminCommand, string>(
      new CreateUserByAdminCommand(dto)
    );

    return this.usersQueryRepository.findByIdOrThrow(userId);
  }

  @Delete(':id')
  @DeleteUserSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.commandBus.execute(new DeleteUserByAdminCommand(id));
  }
}
