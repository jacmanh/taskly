import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
  description: string | null;
  language: string | null;
  default_branch: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  content: string;
}

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private readonly githubApiUrl = 'https://api.github.com';

  constructor(private readonly configService: ConfigService) {}

  /**
   * Get GitHub OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GITHUB_REDIRECT_URI');
    const scope = 'repo,read:user';

    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || '')}&scope=${scope}&state=${state}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<string> {
    const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');

    try {
      const response = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new BadRequestException(
          `GitHub OAuth error: ${data.error_description || data.error}`
        );
      }

      return data.access_token;
    } catch (error) {
      this.logger.error('Failed to exchange code for access token', error);
      throw error;
    }
  }

  /**
   * Get user's repositories
   */
  async getUserRepositories(accessToken: string): Promise<GitHubRepository[]> {
    try {
      const response = await fetch(`${this.githubApiUrl}/user/repos?per_page=100&sort=updated`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Failed to fetch user repositories', error);
      throw error;
    }
  }

  /**
   * Get repository details
   */
  async getRepository(
    owner: string,
    repo: string,
    accessToken: string
  ): Promise<GitHubRepository> {
    try {
      const response = await fetch(
        `${this.githubApiUrl}/repos/${owner}/${repo}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Failed to fetch repository details', error);
      throw error;
    }
  }

  /**
   * Get repository README
   */
  async getRepositoryReadme(
    owner: string,
    repo: string,
    accessToken: string
  ): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.githubApiUrl}/repos/${owner}/${repo}/readme`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3.raw',
          },
        }
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      this.logger.warn('Failed to fetch repository README', error);
      return null;
    }
  }

  /**
   * Get repository file tree
   */
  async getRepositoryTree(
    owner: string,
    repo: string,
    branch: string,
    accessToken: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.githubApiUrl}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Failed to fetch repository tree', error);
      throw error;
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    accessToken: string
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.githubApiUrl}/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3.raw',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      this.logger.warn(`Failed to fetch file content: ${path}`, error);
      return '';
    }
  }
}
