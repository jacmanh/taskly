import { Module } from '@nestjs/common';
import { GitHubController } from './controllers/github.controller';
import { GitHubService } from './services/github.service';
import { GitHubAnalysisService } from './services/github-analysis.service';

@Module({
  controllers: [GitHubController],
  providers: [GitHubService, GitHubAnalysisService],
  exports: [GitHubService, GitHubAnalysisService],
})
export class GitHubModule {}
