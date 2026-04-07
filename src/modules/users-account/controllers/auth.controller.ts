import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserLoginSwaggerDecorator } from '../decorators/swagger/user-login-swagger.decorator';
import {
  NewPasswordRequestBodyValidationDto,
  PasswordRecoveryRequestBodyValidationDto,
  RegistrationConfirmationRequestBodyValidationDto,
  RegistrationEmailResendingRequestBodyValidationDto,
  RegistrationRequestBodyValidationDto,
  UserLoginRequestBodyValidationDto,
} from '../dto/validation/auth.validation';
import { PasswordRecoverySwaggerDecorator } from '../decorators/swagger/password-recovery-swagger.decorator';
import { NewPasswordSwaggerDecorator } from '../decorators/swagger/new-password-swagger.decorator';
import { RegistrationConfirmationSwaggerDecorator } from '../decorators/swagger/registration-confirmation-swagger.decorator';
import { RegistrationSwaggerDecorator } from '../decorators/swagger/registration-swagger.decorator';
import { RegistrationEmailResendingSwaggerDecorator } from '../decorators/swagger/registration-email-resending-swagger.decorator';
import { MeSwaggerDecorator } from '../decorators/swagger/me-swagger.decorator';
import { BearerAuthGuard } from '../guards/bearer-auth/bearer-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { AppThrottle } from 'src/core/decorators';
import { SkipThrottle } from '@nestjs/throttler';
import { UserFromRequest } from '../decorators/user-from-request.decorator';
import { type UserFromRequestData } from '../dto/contracts/auth.dto';

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
    return this.authService.newPassword(dto);
  }

  @Post('registration')
  @RegistrationSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: RegistrationRequestBodyValidationDto) {
    return this.authService.registration(dto);
  }

  @Post('registration-confirmation')
  @RegistrationConfirmationSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() dto: RegistrationConfirmationRequestBodyValidationDto) {
    return this.authService.registrationConfirmation(dto);
  }

  @Post('registration-email-resending')
  @RegistrationEmailResendingSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() dto: RegistrationEmailResendingRequestBodyValidationDto
  ) {
    return this.authService.registrationEmailResending(dto);
  }

  @Get('me')
  @SkipThrottle()
  @ApiBearerAuth('bearerAuth')
  @UseGuards(BearerAuthGuard)
  @MeSwaggerDecorator()
  async me(@UserFromRequest() dto: UserFromRequestData) {
    return dto;
  }
}
