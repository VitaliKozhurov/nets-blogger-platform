import { Controller, Delete, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cookies } from 'src/core/decorators';
import { UUIDValidationPipe } from 'src/core/pipes';
import { GetDeviceSessionsQuery } from '../application/queries/get-device-session.query-handler';
import { DeleteAllUserDeviceSessionsExceptCurrentCommand } from '../application/use-cases/delete-all-user-device-sessions-except-current.usecase';
import { DeleteCurrentDeviceSessionCommand } from '../application/use-cases/delete-current-device-session.usecase';
import { DeleteSessionSwagger } from '../decorators/swagger/delete-session-swagger.decorator';
import { DeleteSessionsSwagger } from '../decorators/swagger/delete-sessions-swagger.decorator';
import { GetDeviceSessionsSwagger } from '../decorators/swagger/get-device-session-swagger.decorator';

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

  @Delete()
  @DeleteSessionsSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessionsExceptCurrent(@Cookies('refreshToken') refreshToken: string) {
    return this.commandBus.execute(
      new DeleteAllUserDeviceSessionsExceptCurrentCommand(refreshToken)
    );
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
