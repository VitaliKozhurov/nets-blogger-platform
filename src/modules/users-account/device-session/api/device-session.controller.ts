import { Controller, Delete, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cookies } from 'src/core/decorators';
import { UUIDValidationPipe } from 'src/core/pipes';
import { GetDeviceSessionsQuery } from '../application/queries';
import {
  DeleteSessionsSwagger,
  DeleteSessionSwagger,
  GetDeviceSessionsSwagger,
} from '../decorators';
import { DeleteAllDeviceSessionsExceptCurrentCommand } from '../application/use-cases';
import { DeleteCurrentDeviceSessionCommand } from '../application/use-cases/delete-current-device-session.usecase';

@Controller('security/devices')
export class DeviceSessionController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Get()
  @GetDeviceSessionsSwagger()
  async findAll(@Cookies('refreshToken') refreshToken: string) {
    const result = await this.queryBus.execute(new GetDeviceSessionsQuery(refreshToken));

    return result;
  }

  @Delete()
  @DeleteSessionsSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessionsExceptCurrent(@Cookies('refreshToken') refreshToken: string) {
    return this.commandBus.execute(new DeleteAllDeviceSessionsExceptCurrentCommand(refreshToken));
  }

  @Delete(':id')
  @DeleteSessionSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCurrentOwnerSession(
    @Param('id', UUIDValidationPipe) id: string,
    @Cookies('refreshToken') refreshToken: string
  ) {
    return this.commandBus.execute(
      new DeleteCurrentDeviceSessionCommand({ deviceId: id, refreshToken })
    );
  }
}
