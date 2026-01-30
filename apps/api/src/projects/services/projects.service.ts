import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from '../repositories/projects.repository';
import { AuthorizationService } from '../../authorization/authorization.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly repo: ProjectsRepository,
    private readonly authService: AuthorizationService
  ) {}

  /**
   * Get all projects for the current user (across all workspaces)
   */
  async findAll(userId: string) {
    return this.repo.findByUserId(userId);
  }

  /**
   * Get all projects for a specific workspace
   * Verifies user has access to the workspace
   */
  async findByWorkspaceId(workspaceId: string, userId: string) {
    await this.authService.verifyWorkspaceAccess(workspaceId, userId);
    return this.repo.findByWorkspaceId(workspaceId);
  }

  /**
   * Get a specific project by ID within a workspace
   * Verifies the project belongs to the workspace and user has access
   */
  async findOne(workspaceId: string, projectId: string, userId: string) {
    const project = await this.authService.verifyProjectInWorkspace(
      projectId,
      workspaceId,
      userId
    );
    return project;
  }

  /**
   * Create a new project in a workspace
   * Verifies user has access to the workspace
   */
  async create(workspaceId: string, dto: CreateProjectDto, userId: string) {
    await this.authService.verifyWorkspaceAccess(workspaceId, userId);

    const slug = this.generateSlug(dto.name);

    return this.repo.create({
      name: dto.name,
      slug,
      description: dto.description || null,
      context: dto.context || null,
      workspace: {
        connect: { id: workspaceId },
      },
    });
  }

  /**
   * Update a project
   * Verifies the project belongs to the workspace and user has access
   */
  async update(
    workspaceId: string,
    projectId: string,
    dto: UpdateProjectDto,
    userId: string
  ) {
    await this.authService.verifyProjectInWorkspace(
      projectId,
      workspaceId,
      userId
    );

    // If name is being updated, regenerate slug
    const slug = dto.name ? this.generateSlug(dto.name) : undefined;

    return this.repo.update(projectId, {
      ...dto,
      ...(slug && { slug }),
    });
  }

  /**
   * Delete a project
   * Verifies the project belongs to the workspace and user has access
   */
  async remove(workspaceId: string, projectId: string, userId: string) {
    await this.authService.verifyProjectInWorkspace(
      projectId,
      workspaceId,
      userId
    );
    return this.repo.delete(projectId);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD') // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }
}
