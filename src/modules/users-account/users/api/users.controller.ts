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
import { CreateUserByAdminRequestDto } from './dto/create-user-by-admin.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { GetUsersQuery } from '../application/queries/get-users.query-handler';
import { CreateUserByAdminCommand } from '../application/use-cases/create-user-by-admin.usecase';
import { DeleteUserByAdminCommand } from '../application/use-cases/delete-user-by-admin.usecase';
import { CreateUserByAdminSwagger } from '../decorators/swagger/create-user-swagger.decorator';
import { DeleteUserSwagger } from '../decorators/swagger/delete-user-swagger.decorator';
import { GetUsersSwagger } from '../decorators/swagger/get-users-swagger.decorator';
import { UseBasicGuard } from '../../auth/decorators/basic-auth/use-basic-guard.decorator';
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
