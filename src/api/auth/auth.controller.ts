import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dto';
import { Response } from 'express';
import { IsPublic } from 'src/shared/decorators/auth.decorators';

@Controller('authentication')
@ApiTags('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @IsPublic()
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @Post('sign-in')
  @IsPublic()
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @Post('forgot-password')
  @IsPublic()
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  @IsPublic()
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body);
  }
}
