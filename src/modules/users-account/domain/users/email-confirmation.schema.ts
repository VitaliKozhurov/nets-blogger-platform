import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class EmailConfirmation {
  @Prop({ type: Boolean, required: true })
  isConfirmed: boolean;

  @Prop({ type: String, nullable: true })
  confirmationCode: string | null;

  @Prop({ type: Date, nullable: true })
  expirationDate: Date | null;
}

export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);
