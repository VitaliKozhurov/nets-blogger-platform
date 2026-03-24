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
import { UsersQueryRepository } from '../../repository/users/users-query.repository';
import { UsersService } from '../../application/users/users.service';
import { GetUsersQueryParamsDto } from '../../dto/users/get-users-query-params.dto';
import { CreateUserRequestDto } from '../../dto/users/create-user-request.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService
  ) {}

  @Get()
  async getAll(@Query() query: GetUsersQueryParamsDto) {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  async create(@Body() dto: CreateUserRequestDto) {
    const userId = await this.usersService.create(dto);

    return this.usersQueryRepository.getByIdOrThrowNotFoundError(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
