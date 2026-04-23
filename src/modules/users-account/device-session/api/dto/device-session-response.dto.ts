import { ApiProperty } from '@nestjs/swagger';

export class DeviceSessionResponseDto {
  @ApiProperty({
    type: String,
    description: 'IP adders of user device',
    example: '10.0.0.1',
  })
  ip: string;

  @ApiProperty({
    type: String,
    description: 'Device name',
    example: 'Huawei Mate 10 Pro',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Unique device identifier',
    example: '507f1f77bcf86cd799439011',
  })
  deviceId: string;

  @ApiProperty({
    type: String,
    description: 'Last connection date',
    example: '2026-03-31T10:30:00.000Z',
    format: 'date-time',
  })
  lastActiveDate: string;
}
