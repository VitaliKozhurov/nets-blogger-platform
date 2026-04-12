import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AppThrottle } from 'src/core/decorators';
import { LoginSwagger } from '../decorators/swagger/auth/login-swagger.decorator';
import { MeSwagger } from '../decorators/swagger/auth/me-swagger.decorator';
import { NewPasswordSwagger } from '../decorators/swagger/auth/new-password-swagger.decorator';
import { PasswordRecoverySwagger } from '../decorators/swagger/auth/password-recovery-swagger.decorator';
import { RegistrationConfirmationSwagger } from '../decorators/swagger/auth/registration-confirmation-swagger.decorator';
import { RegistrationEmailResendingSwagger } from '../decorators/swagger/auth/registration-email-resending-swagger.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationCommand } from '../application/use-cases/auth/registration.usecase';
import { RegistrationSwagger } from '../decorators/swagger/auth/registration-swagger.decorator';
import { UserFromRequest } from '../decorators/user-from-request.decorator';
import { BearerAuthGuard } from '../guards/bearer-auth/bearer-auth.guard';
import { LoginRequestDto } from './dto/auth/login.dto';
import { NewPasswordRequestDto } from './dto/auth/new-password.dto';
import { PasswordRecoveryRequestDto } from './dto/auth/password-recovery.dto';
import { RegistrationConfirmationRequestDto } from './dto/auth/registration-confirmation.dto';
import { RegistrationEmailResendingRequestDto } from './dto/auth/registration-email-resending.dto';
import { RegistrationRequestDto } from './dto/auth/registration.dto';
import { RegistrationConfirmationCommand } from '../application/use-cases/auth/registration-confirmation.usecase';
import { RegistrationEmailResendingCommand } from '../application/use-cases/auth/registration-email-resending.usecase';
import { LoginCommand } from '../application/use-cases/auth/login.usecase';
import { PasswordRecoveryCommand } from '../application/use-cases/auth/password-recovery.usecase';
import { NewUserPasswordCommand } from '../application/use-cases/auth/new-user-password.usecase';
import { type RequestUserDto } from '../application/dto/request-user.dto';

@AppThrottle({ limit: 5, ttl: 10_000 })
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('registration')
  @RegistrationSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() dto: RegistrationRequestDto) {
    return this.commandBus.execute(new RegistrationCommand(dto));
  }

  @Post('registration-confirmation')
  @RegistrationConfirmationSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() dto: RegistrationConfirmationRequestDto) {
    return this.commandBus.execute(new RegistrationConfirmationCommand(dto));
  }

  @Post('registration-email-resending')
  @RegistrationEmailResendingSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() dto: RegistrationEmailResendingRequestDto) {
    return this.commandBus.execute(new RegistrationEmailResendingCommand(dto));
  }

  @Post('login')
  @SkipThrottle()
  @LoginSwagger()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto) {
    return this.commandBus.execute(new LoginCommand(dto));
  }

  @Post('password-recovery')
  @PasswordRecoverySwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto: PasswordRecoveryRequestDto) {
    return this.commandBus.execute(new PasswordRecoveryCommand(dto));
  }

  @Post('new-password')
  @NewPasswordSwagger()
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() dto: NewPasswordRequestDto) {
    return this.commandBus.execute(new NewUserPasswordCommand(dto));
  }

  @Get('me')
  @SkipThrottle()
  @ApiBearerAuth('bearerAuth')
  @UseGuards(BearerAuthGuard)
  @MeSwagger()
  async me(@UserFromRequest() dto: RequestUserDto) {
    return dto;
  }
}
