import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import type { RegisterDto } from './dto/register-dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { rtCookieOpts } from './config/cookieOpts';
import type { RequestWithUser } from './types/requests';
import { RefreshAuthGuard } from './guards/jwt-refresh-auth/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // --- REGISTER (self-signup) ---
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.auth.register(dto);
    res.cookie('rt', refreshToken, rtCookieOpts);
    return { user, accessToken };
  }

  // --- LOGIN (Local strategy) ---
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = this.auth.login(req.user);
    res.cookie('rt', refreshToken, rtCookieOpts);
    return { user, accessToken };
  }

  // --- REFRESH (reads HttpOnly cookie) ---
  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.auth.refresh(
      req.user.id,
    );
    res.cookie('rt', refreshToken, rtCookieOpts);
    return { user, accessToken };
  }

  // --- LOGOUT (clear cookie) ---
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('rt', { path: '/auth/refresh' });
    return { success: true };
  }

  // --- ME (requires JwtStrategy to set req.user) ---
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: RequestWithUser) {
    return this.auth.me(req.user.id);
  }
}
