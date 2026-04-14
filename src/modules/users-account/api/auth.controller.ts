import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AppThrottle } from 'src/core/decorators';
import {
  LoginCommand,
  NewUserPasswordCommand,
  PasswordRecoveryCommand,
  RegistrationCommand,
  RegistrationConfirmationCommand,
  RegistrationEmailResendingCommand,
} from '../application/use-cases';
import {
  LoginSwagger,
  MeSwagger,
  NewPasswordSwagger,
  PasswordRecoverySwagger,
  RegistrationConfirmationSwagger,
  RegistrationEmailResendingSwagger,
  RegistrationSwagger,
} from '../decorators/swagger';
import { type RequestUserDto } from '../contracts';
import { UserFromRequest } from '../decorators';
import { BearerAuthGuard } from '../guards';
import {
  LoginRequestDto,
  NewPasswordRequestDto,
  PasswordRecoveryRequestDto,
  RegistrationConfirmationRequestDto,
  RegistrationEmailResendingRequestDto,
  RegistrationRequestDto,
} from './dto';

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
