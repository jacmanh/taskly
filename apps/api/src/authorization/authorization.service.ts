import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { WorkspacesRepository } from '../workspaces/repositories/workspaces.repository';
import { ProjectsRepository } from '../projects/repositories/projects.repository';
import { TasksRepository } from '../tasks/repositories/tasks.repository';
import { createApiError } from '../common/errors/api-error.util';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly workspacesRepo: WorkspacesRepository,
    private readonly projectsRepo: ProjectsRepository,
    private readonly tasksRepo: TasksRepository
  ) {}

  /**
   * Verify that a user has access to a workspace
   * Currently checks ownership, will be extended to support WorkspaceMember roles
   */
  async verifyWorkspaceAccess(workspaceId: string, userId: string) {
    const workspace = await this.workspacesRepo.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'WORKSPACE_NOT_FOUND',
          `Workspace not found.`
        )
      );
    }

    // Check if user is the owner
    if (workspace.ownerId !== userId) {
      // TODO: Check WorkspaceMember table for role-based access
      throw new ForbiddenException(
        createApiError(
          HttpStatus.FORBIDDEN,
          'WORKSPACE_ACCESS_DENIED',
          'You do not have access to this workspace.'
        )
      );
    }

    return workspace;
  }

  /**
   * Verify that a user has access to a project (via workspace access)
   */
  async verifyProjectAccess(projectId: string, userId: string) {
    const project = await this.projectsRepo.findById(projectId);

    if (!project) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'PROJECT_NOT_FOUND',
          'Project not found.'
        )
      );
    }

    // Verify workspace access
    await this.verifyWorkspaceAccess(project.workspaceId, userId);

    return project;
  }

  /**
   * Verify that a project belongs to a specific workspace
   */
  async verifyProjectInWorkspace(
    projectId: string,
    workspaceId: string,
    userId: string
  ) {
    // First verify user has access to the workspace
    await this.verifyWorkspaceAccess(workspaceId, userId);

    // Then verify the project exists and belongs to this workspace
    const project = await this.projectsRepo.findById(projectId);

    if (!project) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'PROJECT_NOT_FOUND',
          'Project not found.'
        )
      );
    }

    if (project.workspaceId !== workspaceId) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'PROJECT_NOT_IN_WORKSPACE',
          'Project not found in this workspace.'
        )
      );
    }

    return project;
  }

  /**
   * Verify that a user has access to a task (via workspace access)
   */
  async verifyTaskAccess(taskId: string, userId: string) {
    const task = await this.tasksRepo.findById(taskId);

    if (!task) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'TASK_NOT_FOUND',
          'Task not found.'
        )
      );
    }

    // Verify workspace access via project
    await this.verifyWorkspaceAccess(task.project.workspaceId, userId);

    return task;
  }

  /**
   * Verify that a task belongs to a specific workspace
   */
  async verifyTaskInWorkspace(
    taskId: string,
    workspaceId: string,
    userId: string
  ) {
    // First verify user has access to the workspace
    await this.verifyWorkspaceAccess(workspaceId, userId);

    // Then verify the task exists and belongs to this workspace
    const task = await this.tasksRepo.findById(taskId);

    if (!task) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'TASK_NOT_FOUND',
          'Task not found.'
        )
      );
    }

    if (task.project.workspaceId !== workspaceId) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'TASK_NOT_IN_WORKSPACE',
          'Task not found in this workspace.'
        )
      );
    }

    return task;
  }
}
