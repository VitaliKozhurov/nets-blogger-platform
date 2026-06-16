import { UserDeviceSessionEntity } from '../../domain/user-device-session.entity';

export class DeviceSessionMapperDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(session: UserDeviceSessionEntity): DeviceSessionMapperDto {
    const dto = new DeviceSessionMapperDto();

    dto.ip = session.ip;
    dto.title = session.deviceName;
    dto.lastActiveDate = new Date(session.iat * 1000).toISOString();
    dto.deviceId = session.deviceId;

    return dto;
  }
}
