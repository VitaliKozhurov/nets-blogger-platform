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
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../application/users.service';
import { CreateUserRequestDto } from '../dto/users/create-user-request.dto';
import { GetUsersQueryParamsDto } from '../dto/users/get-users-query-params.dto';
import { UserResponseDto } from '../dto/users/user-response.dto';
import { UsersQueryRepository } from '../repository/users/users-query.repository';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository
  ) {}

  @ApiOperation({
    summary: 'Get users by query params',
    description: 'Get users with pagination, sort and filter params',
  })
  @ApiOkResponse({ description: 'Return array of users', type: UserResponseDto })
  @Get()
  async findAll(@Query() query: GetUsersQueryParamsDto) {
    return this.usersQueryRepository.findAll(query);
  }

  @ApiOperation({
    summary: 'Create new user',
    description: 'Create new user handler description',
  })
  @ApiBody({ type: CreateUserRequestDto, description: 'Data for new user entity' })
  @ApiCreatedResponse({ description: 'Success' })
  @Post()
  async create(@Body() dto: CreateUserRequestDto) {
    const userId = await this.usersService.create(dto);

    return this.usersQueryRepository.findByIdOrThrow(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
