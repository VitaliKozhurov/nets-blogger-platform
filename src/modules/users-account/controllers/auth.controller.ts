import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserLoginSwaggerDecorator } from '../decorators/user-login-swagger.decorator';
import {
  NewPasswordRequestBodyValidationDto,
  PasswordRecoveryRequestBodyValidationDto,
  RegistrationConfirmationRequestBodyValidationDto,
  RegistrationEmailResendingRequestBodyValidationDto,
  RegistrationRequestBodyValidationDto,
  UserLoginRequestBodyValidationDto,
} from '../dto/validation/auth.validation';
import { PasswordRecoverySwaggerDecorator } from '../decorators/password-recovery-swagger.decorator';
import { NewPasswordSwaggerDecorator } from '../decorators/new-password-swagger.decorator';
import { RegistrationConfirmationSwaggerDecorator } from '../decorators/registration-confirmation-swagger.dto';
import { RegistrationSwaggerDecorator } from '../decorators/registration-swagger.decorator';
import { RegistrationEmailResendingSwaggerDecorator } from '../decorators/registration-email-resending-swagger.decortor';
import { MeSwaggerDecorator } from '../decorators/me-swagger.decorator';
import { BearerAuthGuard } from '../guards/bearer-auth/bearer-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UserLoginSwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: UserLoginRequestBodyValidationDto) {
    return dto;
  }

  @Post('password-recovery')
  @PasswordRecoverySwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto: PasswordRecoveryRequestBodyValidationDto) {
    return dto;
  }

  @Post('new-password')
  @NewPasswordSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() dto: NewPasswordRequestBodyValidationDto) {
    return dto;
  }

  @Post('registration')
  @RegistrationSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: RegistrationRequestBodyValidationDto) {
    return dto;
  }

  @Post('registration-confirmation')
  @RegistrationConfirmationSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() dto: RegistrationConfirmationRequestBodyValidationDto) {
    return dto;
  }

  @Post('registration-email-resending')
  @RegistrationEmailResendingSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() dto: RegistrationEmailResendingRequestBodyValidationDto
  ) {
    return dto;
  }

  @Get('me')
  @ApiBearerAuth('bearerAuth')
  @UseGuards(BearerAuthGuard)
  @MeSwaggerDecorator()
  async me() {}
}
