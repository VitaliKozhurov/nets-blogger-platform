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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBasicAuth } from '@nestjs/swagger';
import { CreateUserByAdminCommand, DeleteUserByAdminCommand } from '../application/use-cases';
import {
  CreateUserByAdminSwagger,
  DeleteUserSwagger,
  GetUsersSwagger,
} from '../decorators/swagger';
import { CreateUserByAdminRequestDto, GetUsersQueryDto } from './dto';
import { UseBasicGuard } from '../../auth/decorators';
import { GetUsersQuery } from '../application/queries';
import { UUIDValidationPipe } from 'src/core/pipes';

@Controller('sa/users')
@UseBasicGuard()
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Get()
  @GetUsersSwagger()
  async getUsers(@Query() query: GetUsersQueryDto) {
    const result = await this.queryBus.execute(new GetUsersQuery(query));

    return result;
  }

  @Post()
  @CreateUserByAdminSwagger()
  async create(@Body() dto: CreateUserByAdminRequestDto) {
    const createdUser = await this.commandBus.execute(new CreateUserByAdminCommand(dto));

    return createdUser;
  }

  @Delete(':id')
  @DeleteUserSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', UUIDValidationPipe) id: string) {
    return this.commandBus.execute(new DeleteUserByAdminCommand(id));
  }
}
