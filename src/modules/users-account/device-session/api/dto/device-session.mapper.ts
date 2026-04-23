import { DeviceSessionDocument } from '../../domain';

export class DeviceSessionMapperDto {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  static mapToView(userDocument: DeviceSessionDocument): DeviceSessionMapperDto {
    const dto = new DeviceSessionMapperDto();

    dto.ip = userDocument.ip;
    dto.title = userDocument.deviceName;
    dto.lastActiveDate = new Date(userDocument.iat * 1000).toISOString();
    dto.deviceId = userDocument.deviceId;

    return dto;
  }
}
