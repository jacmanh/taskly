import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from '../services/workspaces.service';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace.dto';
import { FindWorkspaceUsersQueryDto } from '../dto/find-workspace-users-query.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '@taskly/types';
import { GitHubAnalysisService } from '../../github/services/github-analysis.service';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(
    private readonly service: WorkspacesService,
    private readonly githubAnalysisService: GitHubAnalysisService
  ) {}

  @Get()
  findByCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findByCurrentUser(user.id);
  }

  @Get(':id/users')
  findUsers(
    @Param('id') id: string,
    @Query() query: FindWorkspaceUsersQueryDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.findUsers(id, user.id, query.search);
  }

  @Post()
  create(
    @Body() dto: CreateWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.service.remove(id, user.id);
  }

  @Post(':id/github/connect')
  async connectGitHub(
    @Param('id') id: string,
    @Body('owner') owner: string,
    @Body('repo') repo: string,
    @Body('accessToken') accessToken: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    // Analyze the repository
    const context = await this.githubAnalysisService.analyzeRepository(
      owner,
      repo,
      accessToken
    );

    // Update workspace with GitHub info
    const repoUrl = `https://github.com/${owner}/${repo}`;
    return this.service.update(
      id,
      {
        githubRepoUrl: repoUrl,
        githubRepoName: repo,
        githubOwner: owner,
        aiGeneratedContext: context,
      },
      user.id
    );
  }
}
