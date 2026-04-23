import { HydratedDocument, Model } from 'mongoose';
import { DeviceSession } from './device-session.schema';
import { CreateDeviceSessionInstanceDto } from './device-session.dto';

export type DeviceSessionDocument = HydratedDocument<DeviceSession>;

export type DeviceSessionMethodsType = {
  updateSession(args: { iat: number; expirationAt: number }): void;
  deleteSession(): Promise<void>;
};

export type DeviceSessionStaticMethodsType = {
  createDeviceSessionInstance(dto: CreateDeviceSessionInstanceDto): Promise<DeviceSessionDocument>;
};

export type DeviceSessionModelType = Model<
  DeviceSessionDocument,
  unknown,
  DeviceSessionMethodsType
> &
  DeviceSessionStaticMethodsType;
