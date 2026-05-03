import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RegistrationConfirmationRequestDto {
  @ApiProperty({
    type: String,
    description: 'Email confirmation code sent to the user during registration',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID(undefined, { message: 'Incorrect confirmation code' })
  code: string;
}
