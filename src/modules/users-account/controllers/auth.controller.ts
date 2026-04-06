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
import { RegistrationConfirmationSwaggerDecorator } from '../decorators/registration-confirmation-swagger.decorator';
import { RegistrationSwaggerDecorator } from '../decorators/registration-swagger.decorator';
import { RegistrationEmailResendingSwaggerDecorator } from '../decorators/registration-email-resending-swagger.decorator';
import { MeSwaggerDecorator } from '../decorators/me-swagger.decorator';
import { BearerAuthGuard } from '../guards/bearer-auth/bearer-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { AppThrottle } from 'src/core/decorators';
import { SkipThrottle } from '@nestjs/throttler';

@AppThrottle({ limit: 5, ttl: 10_000 })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @SkipThrottle()
  @UserLoginSwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: UserLoginRequestBodyValidationDto) {
    return this.authService.login(dto);
  }

  @Post('password-recovery')
  @PasswordRecoverySwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto: PasswordRecoveryRequestBodyValidationDto) {
    return this.authService.passwordRecovery(dto);
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
  @SkipThrottle()
  @ApiBearerAuth('bearerAuth')
  @UseGuards(BearerAuthGuard)
  @MeSwaggerDecorator()
  async me() {}
}
