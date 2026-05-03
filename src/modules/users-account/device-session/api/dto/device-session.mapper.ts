import { IDeviceSessionRepositoryDto } from '../../repository/dto/device-session-repository.dto';

export class DeviceSessionMapperDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(session: IDeviceSessionRepositoryDto): DeviceSessionMapperDto {
    const dto = new DeviceSessionMapperDto();

    dto.ip = session.ip;
    dto.title = session.deviceName;
    dto.lastActiveDate = new Date(session.iat * 1000).toISOString();
    dto.deviceId = session.deviceId;

    return dto;
  }
}
