import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AppThrottle, ClientMeta, Cookies, type ClientMetaDto } from 'src/core/decorators';
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
  RefreshTokenSwagger,
  RegistrationConfirmationSwagger,
  RegistrationEmailResendingSwagger,
  RegistrationSwagger,
} from '../decorators/swagger';

import {
  LoginRequestDto,
  NewPasswordRequestDto,
  PasswordRecoveryRequestDto,
  RegistrationConfirmationRequestDto,
  RegistrationEmailResendingRequestDto,
  RegistrationRequestDto,
} from './dto';
import { UseBearerGuard } from '../decorators/bearer-auth/use-bearer-guard.decorator';
import { type Response } from 'express';
import { UserFromRequest } from '../decorators';
import { RefreshTokenCommand, type RequestUserDto } from '../application';

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
  @LoginSwagger()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginRequestDto,
    @ClientMeta() clientMeta: ClientMetaDto,
    @Res() response: Response
  ) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginCommand({ ...dto, ...clientMeta })
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    response.send({ accessToken });
  }

  @Post('refresh-token')
  @RefreshTokenSwagger()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Cookies('refreshToken') refreshToken: string, @Res() response: Response) {
    const result = await this.commandBus.execute(new RefreshTokenCommand(refreshToken));

    response.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    response.send({ accessToken: result.accessToken });
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
  @UseBearerGuard()
  @MeSwagger()
  async me(@UserFromRequest() dto: RequestUserDto) {
    return dto;
  }
}
