import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type {
  RefreshTokenResponse,
  AuthResponseWithRefreshToken,
} from '@taskly/types';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import {
  JwtPayload,
  JwtRefreshPayload,
} from './interfaces/jwt-payload.interface';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { createApiError } from '../common/errors/api-error.util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(
    registerDto: RegisterDto
  ): Promise<AuthResponseWithRefreshToken> {
    const { email, password, name } = registerDto;

    // Check whether the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        createApiError(
          HttpStatus.CONFLICT,
          'AUTH_EMAIL_ALREADY_EXISTS',
          'An account with this email already exists.'
        )
      );
    }

    // Hash the password with the configured number of rounds
    const rounds = parseInt(
      this.configService.get<string>('BCRYPT_ROUNDS') || '12',
      10
    );
    const hashedPassword = await bcrypt.hash(password, rounds);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate access and refresh tokens
    const accessToken = await this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseWithRefreshToken> {
    const { email, password } = loginDto;

    // Look up the user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(
        createApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_INVALID_CREDENTIALS',
          'Invalid email or password.'
        )
      );
    }

    // Ensure the user account is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        createApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_ACCOUNT_DISABLED',
          'This account has been disabled.'
        )
      );
    }

    // Validate the user password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        createApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_INVALID_CREDENTIALS',
          'Invalid email or password.'
        )
      );
    }

    // Update the user's last login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate fresh tokens after a successful login
    const accessToken = await this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
      },
    };
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    try {
      // Validate the refresh token signature
      await this.jwtService.verifyAsync<JwtRefreshPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check whether the refresh token record exists
      const tokenRecord = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord) {
        throw new UnauthorizedException(
          createApiError(
            HttpStatus.UNAUTHORIZED,
            'AUTH_INVALID_REFRESH_TOKEN',
            'Refresh token is invalid.'
          )
        );
      }

      // Remove an expired token and stop the flow
      if (tokenRecord.expiresAt < new Date()) {
        await this.prisma.refreshToken.delete({
          where: { id: tokenRecord.id },
        });
        throw new UnauthorizedException(
          createApiError(
            HttpStatus.UNAUTHORIZED,
            'AUTH_REFRESH_TOKEN_EXPIRED',
            'Refresh token has expired.'
          )
        );
      }

      // Ensure the associated user is still active
      if (!tokenRecord.user.isActive) {
        throw new UnauthorizedException(
          createApiError(
            HttpStatus.UNAUTHORIZED,
            'AUTH_ACCOUNT_DISABLED',
            'This account has been disabled.'
          )
        );
      }

      // Issue a new access token
      const accessToken = await this.generateAccessToken(
        tokenRecord.user.id,
        tokenRecord.user.email
      );

      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        createApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_REFRESH_TOKEN_INVALID',
          'Refresh token is invalid or expired.'
        )
      );
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Remove the provided refresh token only
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Remove all refresh tokens tied to the user
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  async validateUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        emailVerified: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        createApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_USER_NOT_FOUND',
          'User not found or inactive.'
        )
      );
    }

    return user;
  }

  private async generateAccessToken(
    userId: string,
    email: string
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const expiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') ||
      '15m') as JwtSignOptions['expiresIn'];

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn,
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const tokenId = Math.random().toString(36).substring(2);

    const payload: JwtRefreshPayload = {
      sub: userId,
      tokenId,
    };

    const refreshExpiresIn = (this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN'
    ) || '7d') as JwtSignOptions['expiresIn'];

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpiresIn,
    });

    // Compute the expiration date from the configured TTL string
    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const expiresAt = this.calculateExpirationDate(expiresIn);

    // Persist the refresh token in the database for revocation tracking
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return refreshToken;
  }

  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);

    if (!match) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'AUTH_INVALID_EXPIRATION_FORMAT',
          'Invalid expiration format. Expected value+unit, e.g. 15m.'
        )
      );
    }

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 's':
        return new Date(now.getTime() + numValue * 1000);
      case 'm':
        return new Date(now.getTime() + numValue * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + numValue * 60 * 60 * 1000);
      case 'd':
        return new Date(now.getTime() + numValue * 24 * 60 * 60 * 1000);
      default:
        throw new BadRequestException(
          createApiError(
            HttpStatus.BAD_REQUEST,
            'AUTH_INVALID_EXPIRATION_UNIT',
            'Invalid expiration unit. Use s, m, h, or d.'
          )
        );
    }
  }

  // Utility method to clean up expired refresh tokens
  async cleanupExpiredTokens(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
