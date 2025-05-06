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
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const access_token = await this.authService.signUp(body);

    res.cookie('access_token', access_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      partitioned: true,
    });

    return res.status(200).json({
      message: 'Sign up successful',
      success: true,
    });
  }

  @Post('sign-in')
  @IsPublic()
  async signIn(@Body() body: SignInDto, @Res() res: Response) {
    const access_token = await this.authService.signIn(body);

    res.cookie('access_token', access_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      partitioned: true,
    });

    return res.status(200).json({
      message: 'Sign in successful',
      success: true,
    });
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
