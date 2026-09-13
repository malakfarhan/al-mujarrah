import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(
      data.email,
      data.password,
      request.ip,
    );

    response.cookie('admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    return {
      admin: result.admin,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: Request & { user: any }) {
    return {
      admin: request.user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      message: 'Logged out successfully',
    };
  }
}