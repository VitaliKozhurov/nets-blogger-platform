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
import { UsersService } from '../application/users.service';
import { CreateUserRequestDto } from '../dto/users/create-user-request.dto';
import { GetUsersQueryParamsDto } from '../dto/users/get-users-query-params.dto';
import { UsersQueryRepository } from '../infrastructure/users/users-query.repository';
import { CreateUserSwaggerDecorator } from '../decorators/create-user-swagger.decorator';
import { GetUsersSwaggerDecorator } from '../decorators/get-users-swagger.decorator';
import { DeleteUserSwaggerDecorator } from '../decorators/delete-user-swagger.decorator';
import { BasicAuthGuard } from '../guards/basic-auth/basic-auth.guard';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository
  ) {}

  @GetUsersSwaggerDecorator()
  @Get()
  async findAll(@Query() query: GetUsersQueryParamsDto) {
    return this.usersQueryRepository.findAll(query);
  }

  @CreateUserSwaggerDecorator()
  @Post()
  async create(@Body() dto: CreateUserRequestDto) {
    const userId = await this.usersService.create(dto);

    return this.usersQueryRepository.findByIdOrThrow(userId);
  }

  @DeleteUserSwaggerDecorator()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
