import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateDeviceSessionInstanceDto } from './device-session.dto';

@Schema({ timestamps: true, versionKey: false })
export class DeviceSession {
  id: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  deviceName: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Number, required: true })
  iat: number;

  @Prop({ type: Number, required: true })
  expirationAt: number;

  createdAt: Date;
}

export const DeviceSessionSchema = SchemaFactory.createForClass(DeviceSession);

DeviceSessionSchema.static(
  'createDeviceSessionInstance',
  async function (dto: CreateDeviceSessionInstanceDto) {
    const deviceSession = new this();

    deviceSession.userId = dto.userId;
    deviceSession.deviceId = dto.deviceId;
    deviceSession.deviceName = dto.deviceName;
    deviceSession.ip = dto.ip;
    deviceSession.iat = dto.iat;
    deviceSession.expirationAt = dto.expirationAt;

    return deviceSession;
  }
);
