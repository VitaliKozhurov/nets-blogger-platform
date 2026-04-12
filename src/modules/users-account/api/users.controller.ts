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
import { DeleteUserSwagger } from '../decorators/swagger/user/delete-user-swagger.decorator';
import { GetUsersSwagger } from '../decorators/swagger/user/get-users-swagger.decorator';

import { ObjectIdValidationPipe } from 'src/core/pipes';
import { CreateUserByAdminSwagger } from '../decorators/swagger/user/create-user-swagger.decorator';
import { BasicAuthGuard } from '../guards/basic-auth/basic-auth.guard';
import { UsersQueryRepository } from '../infrastructure/users-query.repository';
import { CreateUserByAdminRequestDto } from './dto/user/create-user-by-admin.dto';
import { GetUsersQueryDto } from './dto/user/get-users-query.dto';

@Controller('users')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private usersService: UsersService,
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
    const userId = await this.usersService.create(dto);

    return this.usersQueryRepository.findByIdOrThrow(userId);
  }

  @Delete(':id')
  @DeleteUserSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.usersService.delete(id);
  }
}
