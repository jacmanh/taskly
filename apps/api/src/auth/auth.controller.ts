import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import type { AuthResponse, RefreshTokenResponse } from '@taskly/types';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser } from '@taskly/types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { createApiError } from '../common/errors/api-error.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // Limit to 3 attempts per minute
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponse> {
    const result = await this.authService.register(registerDto);

    const { accessToken, refreshToken, user } = result;

    // Store the refresh token in an HTTP-only cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return { accessToken, user };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Limit to 5 attempts per minute
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponse> {
    const result = await this.authService.login(loginDto);

    const { accessToken, refreshToken, user } = result;

    // Store the refresh token in an HTTP-only cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return { accessToken, user };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request): Promise<RefreshTokenResponse> {
    // Retrieve the refresh token from the cookie jar
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException(
        createApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_REFRESH_TOKEN_MISSING',
          'Refresh token is missing.'
        )
      );
    }

    return this.authService.refreshAccessToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<void> {
    const refreshToken = request.cookies?.refreshToken;
    await this.authService.logout(user.id, refreshToken);

    // Clear the refresh token cookie on logout
    response.clearCookie('refreshToken', { path: '/' });
  }
}
