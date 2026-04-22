import { HydratedDocument, Model } from 'mongoose';
import { DeviceSession } from './device-session.schema';
import { CreateDeviceSessionInstanceDto } from './device-session.dto';

export type DeviceSessionDocument = HydratedDocument<DeviceSession>;

export type DeviceSessionMethodsType = {
  someMethods(): void;
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
