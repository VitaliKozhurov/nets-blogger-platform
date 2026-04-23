import { Controller, Delete, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cookies } from 'src/core/decorators';
import { ObjectIdValidationPipe } from 'src/core/pipes';
import { GetDeviceSessionsQuery } from '../application/queries';
import { GetDeviceSessionsSwagger } from '../decorators';
import {
  DeleteAllMyDeviceSessionWithoutCurrentCommand,
  DeleteMyDeviceSessionCommand,
} from '../application/use-cases';

@Controller('security/devices')
export class DeviceSessionController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Get()
  @GetDeviceSessionsSwagger()
  async findAll(@Cookies('refreshToken') refreshToken: string) {
    return this.queryBus.execute(new GetDeviceSessionsQuery(refreshToken));
  }

  // TODO add swagger
  @Delete()
  //   @DeleteUserSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOwnerSessions(@Cookies('refreshToken') refreshToken: string) {
    return this.commandBus.execute(new DeleteAllMyDeviceSessionWithoutCurrentCommand(refreshToken));
  }

  // TODO add swagger
  @Delete(':id')
  //   @DeleteUserSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Cookies('refreshToken') refreshToken: string
  ) {
    return this.commandBus.execute(
      new DeleteMyDeviceSessionCommand({ deviceId: id, refreshToken })
    );
  }
}
