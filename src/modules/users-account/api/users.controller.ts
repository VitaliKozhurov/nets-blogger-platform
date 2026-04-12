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
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth } from '@nestjs/swagger';
import { DeleteUserSwagger } from '../decorators/swagger/user/delete-user-swagger.decorator';
import { GetUsersSwagger } from '../decorators/swagger/user/get-users-swagger.decorator';

import { ObjectIdValidationPipe } from 'src/core/pipes';
import { CreateUserByAdminSwagger } from '../decorators/swagger/user/create-user-swagger.decorator';
import { BasicAuthGuard } from '../guards/basic-auth/basic-auth.guard';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { CreateUserByAdminRequestDto } from './dto/users/create-user-by-admin.dto';
import { GetUsersQueryDto } from './dto/users/get-users-query.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserByAdminCommand } from '../application/use-cases/users/create-user-by-admin.usecase';
import { DeleteUserByAdminCommand } from '../application/use-cases/users/delete-user-by-admin.usecase';

@Controller('users')
@UseGuards(BasicAuthGuard)
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
