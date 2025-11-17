import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ProjectsService } from '../services/projects.service';
import { AuthenticatedUser } from '@taskly/types';

/**
 * Global projects controller for cross-workspace operations
 * Provides a flat view of all projects across all workspaces
 */
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsGlobalController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findAll(user.id);
  }
}
