import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsStringWithTrim } from 'src/core/decorators';

export class NewPasswordRequestDto {
  @ApiProperty({
    type: String,
    description: 'New user password (must meet security requirements)',
    example: 'NewP@ssw0rd123!',
    minLength: 6,
    maxLength: 20,
  })
  @IsStringWithTrim(6, 20)
  newPassword: string;

  @ApiProperty({
    type: String,
    description: 'Password recovery code received via email',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  recoveryCode: string;
}
