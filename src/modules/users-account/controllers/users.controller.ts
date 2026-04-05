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
import { UsersService } from '../application/users.service';
import { CreateUserSwaggerDecorator } from '../decorators/create-user-swagger.decorator';
import { DeleteUserSwaggerDecorator } from '../decorators/delete-user-swagger.decorator';
import { GetUsersSwaggerDecorator } from '../decorators/get-users-swagger.decorator';

import {
  CreateUserRequestBodyValidationDto,
  GetUsersQueryParamsValidationDto,
} from '../dto/validation/user.validation';
import { BasicAuthGuard } from '../guards/basic-auth/basic-auth.guard';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { ObjectIdValidationPipe } from 'src/core/pipes';

@Controller('users')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository
  ) {}

  @Get()
  @GetUsersSwaggerDecorator()
  async findAll(@Query() query: GetUsersQueryParamsValidationDto) {
    return this.usersQueryRepository.findAll(query);
  }

  @Post()
  @CreateUserSwaggerDecorator()
  async create(@Body() dto: CreateUserRequestBodyValidationDto) {
    const userId = await this.usersService.create(dto);

    return this.usersQueryRepository.findByIdOrThrow(userId);
  }

  @Delete(':id')
  @DeleteUserSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.usersService.delete(id);
  }
}
