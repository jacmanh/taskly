import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GitHubService } from './github.service';

export interface RepositoryAnalysis {
  summary: string;
  techStack: string[];
  mainFeatures: string[];
  architecture: string;
  purpose: string;
}

@Injectable()
export class GitHubAnalysisService {
  private readonly logger = new Logger(GitHubAnalysisService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly githubService: GitHubService,
    private readonly configService: ConfigService
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
  }

  /**
   * Analyze a GitHub repository and generate context
   */
  async analyzeRepository(
    owner: string,
    repo: string,
    accessToken: string
  ): Promise<string> {
    try {
      // Fetch repository information
      const repoDetails = await this.githubService.getRepository(
        owner,
        repo,
        accessToken
      );
      
      const readme = await this.githubService.getRepositoryReadme(
        owner,
        repo,
        accessToken
      );

      const tree = await this.githubService.getRepositoryTree(
        owner,
        repo,
        repoDetails.default_branch,
        accessToken
      );

      // Analyze important files (package.json, requirements.txt, etc.)
      const importantFiles = await this.getImportantFiles(
        owner,
        repo,
        tree.tree,
        accessToken
      );

      // Generate AI context
      const context = await this.generateContext(
        repoDetails,
        readme,
        importantFiles,
        tree.tree
      );

      return context;
    } catch (error) {
      this.logger.error('Failed to analyze repository', error);
      throw error;
    }
  }

  /**
   * Get important configuration and documentation files
   */
  private async getImportantFiles(
    owner: string,
    repo: string,
    tree: any[],
    accessToken: string
  ): Promise<Map<string, string>> {
    const importantFilePatterns = [
      'package.json',
      'requirements.txt',
      'Cargo.toml',
      'go.mod',
      'pom.xml',
      'build.gradle',
      'composer.json',
      'Gemfile',
      '.csproj',
      'tsconfig.json',
      'nest-cli.json',
      'angular.json',
      'next.config.js',
      'vite.config.ts',
      'docker-compose.yml',
      'Dockerfile',
    ];

    const files = new Map<string, string>();
    const filesToFetch = tree
      .filter((item: any) => {
        return (
          item.type === 'blob' &&
          importantFilePatterns.some((pattern) =>
            item.path.toLowerCase().includes(pattern.toLowerCase())
          )
        );
      })
      .slice(0, 10); // Limit to first 10 important files

    for (const file of filesToFetch) {
      try {
        const content = await this.githubService.getFileContent(
          owner,
          repo,
          file.path,
          accessToken
        );
        files.set(file.path, content);
      } catch (error) {
        this.logger.warn(`Failed to fetch file ${file.path}`, error);
      }
    }

    return files;
  }

  /**
   * Generate AI context from repository data
   */
  private async generateContext(
    repoDetails: any,
    readme: string | null,
    importantFiles: Map<string, string>,
    tree: any[]
  ): Promise<string> {
    const systemPrompt = `You are an expert software architect and technical analyst. Your task is to analyze a GitHub repository and provide a comprehensive summary that will help AI agents understand the codebase for generating user stories and tasks.

Focus on:
1. The main purpose and functionality of the project
2. Key technologies and frameworks used
3. Architecture and structure
4. Main features and capabilities
5. Domain model and business logic

Be concise but comprehensive. Format the output as a well-structured text summary.`;

    const fileStructure = this.buildFileStructure(tree);
    const filesContent = Array.from(importantFiles.entries())
      .map(([path, content]) => {
        // Truncate large files
        const truncated = content.length > 2000 ? content.substring(0, 2000) + '\n...(truncated)' : content;
        return `\n### ${path}\n\`\`\`\n${truncated}\n\`\`\``;
      })
      .join('\n');

    const userPrompt = `Analyze this GitHub repository and provide a comprehensive context summary:

**Repository**: ${repoDetails.full_name}
**Description**: ${repoDetails.description || 'No description provided'}
**Language**: ${repoDetails.language || 'Multiple/Unknown'}

**README**:
${readme ? readme.substring(0, 3000) : 'No README found'}

**Project Structure** (key directories):
${fileStructure}

**Important Configuration Files**:
${filesContent || 'No configuration files found'}

Generate a detailed context summary that explains what this project does, what technologies it uses, its architecture, and its main features. This context will be used by AI to generate relevant user stories and tasks.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0]?.message?.content || 'Unable to generate context';
    } catch (error) {
      this.logger.error('Failed to generate AI context', error);
      throw error;
    }
  }

  /**
   * Build a readable file structure from tree
   */
  private buildFileStructure(tree: any[]): string {
    const directories = new Set<string>();
    
    tree.forEach((item: any) => {
      if (item.type === 'tree') {
        directories.add(item.path);
      } else if (item.type === 'blob') {
        const dir = item.path.split('/').slice(0, -1).join('/');
        if (dir) {
          directories.add(dir);
        }
      }
    });

    // Group by top-level directories
    const topLevel = new Map<string, number>();
    directories.forEach((dir) => {
      const topDir = dir.split('/')[0];
      topLevel.set(topDir, (topLevel.get(topDir) || 0) + 1);
    });

    return Array.from(topLevel.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([dir, count]) => `- ${dir}/ (${count} subdirectories)`)
      .join('\n');
  }
}
