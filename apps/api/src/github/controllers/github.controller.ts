import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Session,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { GitHubService } from '../services/github.service';
import { GitHubAnalysisService } from '../services/github-analysis.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '@taskly/types';
import { createApiError } from '../../common/errors/api-error.util';
import { randomBytes } from 'crypto';

@Controller('github')
@UseGuards(JwtAuthGuard)
export class GitHubController {
  constructor(
    private readonly githubService: GitHubService,
    private readonly analysisService: GitHubAnalysisService
  ) {}

  /**
   * Initiate GitHub OAuth flow
   */
  @Get('auth/initiate')
  initiateAuth(@Session() session: Record<string, any>) {
    // Generate state for CSRF protection
    const state = randomBytes(32).toString('hex');
    session.githubOAuthState = state;

    const authUrl = this.githubService.getAuthorizationUrl(state);
    return { authUrl };
  }

  /**
   * Handle GitHub OAuth callback
   */
  @Get('auth/callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Session() session: Record<string, any>
  ) {
    // Verify state for CSRF protection
    if (!session.githubOAuthState || session.githubOAuthState !== state) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'INVALID_STATE',
          'Invalid OAuth state parameter'
        )
      );
    }

    // Exchange code for access token
    const accessToken = await this.githubService.getAccessToken(code);

    // Clear state from session
    delete session.githubOAuthState;

    return { accessToken };
  }

  /**
   * Get user's repositories
   */
  @Post('repositories')
  async getRepositories(@Body('accessToken') accessToken: string) {
    if (!accessToken) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'MISSING_ACCESS_TOKEN',
          'GitHub access token is required'
        )
      );
    }

    const repositories = await this.githubService.getUserRepositories(
      accessToken
    );
    return repositories;
  }

  /**
   * Analyze a specific repository
   */
  @Post('analyze')
  async analyzeRepository(
    @Body('owner') owner: string,
    @Body('repo') repo: string,
    @Body('accessToken') accessToken: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    if (!owner || !repo || !accessToken) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'MISSING_PARAMETERS',
          'Owner, repo, and accessToken are required'
        )
      );
    }

    const context = await this.analysisService.analyzeRepository(
      owner,
      repo,
      accessToken
    );

    return { context };
  }
}
