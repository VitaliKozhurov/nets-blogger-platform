import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AppThrottle } from 'src/core/decorators';
import { AuthService } from '../application/auth.service';
import { LoginSwagger } from '../decorators/swagger/login-swagger.decorator';
import { MeSwaggerDecorator } from '../decorators/swagger/me-swagger.decorator';
import { NewPasswordSwaggerDecorator } from '../decorators/swagger/new-password-swagger.decorator';
import { PasswordRecoverySwaggerDecorator } from '../decorators/swagger/password-recovery-swagger.decorator';
import { RegistrationConfirmationSwaggerDecorator } from '../decorators/swagger/registration-confirmation-swagger.decorator';
import { RegistrationEmailResendingSwaggerDecorator } from '../decorators/swagger/registration-email-resending-swagger.decorator';

import { RegistrationSwagger } from '../decorators/swagger/registration-swagger.decorator';
import { UserFromRequest } from '../decorators/user-from-request.decorator';
import { type UserFromRequestData } from '../dto/contracts/auth.dto';
import {
  NewPasswordRequestBodyValidationDto,
  PasswordRecoveryRequestBodyValidationDto,
  RegistrationConfirmationRequestBodyValidationDto,
  RegistrationEmailResendingRequestBodyValidationDto,
} from '../dto/validation/auth.validation';
import { BearerAuthGuard } from '../guards/bearer-auth/bearer-auth.guard';
import { LoginRequestDto } from './dto/auth/login.dto';
import { RegistrationRequestDto } from './dto/auth/registration.dto';

@AppThrottle({ limit: 5, ttl: 10_000 })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  @RegistrationSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: RegistrationRequestDto) {
    return this.authService.registration(dto);
  }

  @Post('registration-confirmation')
  @RegistrationConfirmationSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() dto: RegistrationConfirmationRequestBodyValidationDto) {
    return this.authService.registrationConfirmation(dto);
  }

  @Post('login')
  @SkipThrottle()
  @LoginSwagger()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto) {
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
