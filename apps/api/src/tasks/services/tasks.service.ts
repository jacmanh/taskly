import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { TasksRepository } from '../repositories/tasks.repository';
import { AuthorizationService } from '../../authorization/authorization.service';
import { WorkspacesRepository } from '../../workspaces/repositories/workspaces.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateManyTasksDto } from '../dto/create-many-tasks.dto';
import { createApiError } from '../../common/errors/api-error.util';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepo: TasksRepository,
    private readonly authorizationService: AuthorizationService,
    private readonly workspacesRepo: WorkspacesRepository
  ) {}

  async findByWorkspaceId(
    workspaceId: string,
    userId: string,
    filters?: {
      projectId?: string;
      sprintId?: string;
      assignedId?: string;
      status?: string;
      priority?: string;
      includeArchived?: boolean;
    }
  ) {
    // Verify user has access to the workspace
    await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    return this.tasksRepo.findByWorkspaceId(workspaceId, filters);
  }

  async findOne(workspaceId: string, taskId: string, userId: string) {
    // Verify the task belongs to the workspace and user has access
    const task = await this.authorizationService.verifyTaskInWorkspace(
      taskId,
      workspaceId,
      userId
    );

    return task;
  }

  async create(
    workspaceId: string,
    createTaskDto: CreateTaskDto,
    userId: string
  ) {
    // Verify user has access to the workspace
    await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    // Verify the project exists and belongs to this workspace
    await this.authorizationService.verifyProjectInWorkspace(
      createTaskDto.projectId,
      workspaceId,
      userId
    );

    // If a sprint is provided, verify it belongs to the workspace
    // TODO: Add sprint verification when Sprint service is implemented

    // If assignedId is provided, verify the user exists and has access to workspace
    // TODO: Add user membership verification

    return this.tasksRepo.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status,
      priority: createTaskDto.priority,
      dueDate: createTaskDto.dueDate,
      project: {
        connect: { id: createTaskDto.projectId },
      },
      createdBy: {
        connect: { id: userId },
      },
      ...(createTaskDto.assignedToId && {
        assignedTo: {
          connect: { id: createTaskDto.assignedToId },
        },
      }),
      ...(createTaskDto.sprintId && {
        sprint: {
          connect: { id: createTaskDto.sprintId },
        },
      }),
    });
  }

  async update(
    workspaceId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string
  ) {
    // Verify the task belongs to the workspace and user has access
    await this.authorizationService.verifyTaskInWorkspace(
      taskId,
      workspaceId,
      userId
    );

    // If projectId is being changed, verify the new project belongs to this workspace
    if (updateTaskDto.projectId) {
      await this.authorizationService.verifyProjectInWorkspace(
        updateTaskDto.projectId,
        workspaceId,
        userId
      );
    }

    // If a sprint is provided, verify it belongs to the workspace
    // TODO: Add sprint verification when Sprint service is implemented

    // If assignedId is provided, verify the user exists and has access to workspace
    // TODO: Add user membership verification

    return this.tasksRepo.update(taskId, {
      ...(updateTaskDto.title !== undefined && { title: updateTaskDto.title }),
      ...(updateTaskDto.description !== undefined && {
        description: updateTaskDto.description,
      }),
      ...(updateTaskDto.status !== undefined && {
        status: updateTaskDto.status,
      }),
      ...(updateTaskDto.priority !== undefined && {
        priority: updateTaskDto.priority,
      }),
      ...(updateTaskDto.dueDate !== undefined && {
        dueDate: updateTaskDto.dueDate,
      }),
      ...(updateTaskDto.projectId && {
        project: {
          connect: { id: updateTaskDto.projectId },
        },
      }),
      ...(updateTaskDto.assignedToId !== undefined && {
        assignedTo: updateTaskDto.assignedToId
          ? { connect: { id: updateTaskDto.assignedToId } }
          : { disconnect: true },
      }),
      ...(updateTaskDto.sprintId !== undefined && {
        sprint: updateTaskDto.sprintId
          ? { connect: { id: updateTaskDto.sprintId } }
          : { disconnect: true },
      }),
    });
  }

  async remove(workspaceId: string, taskId: string, userId: string) {
    // Verify the task belongs to the workspace and user has access
    await this.authorizationService.verifyTaskInWorkspace(
      taskId,
      workspaceId,
      userId
    );

    const workspace = await this.workspacesRepo.findById(workspaceId);

    if (workspace?.deleteStrategy === 'HARD') {
      return this.tasksRepo.delete(taskId);
    }

    return this.tasksRepo.archive(taskId);
  }

  async createMany(
    workspaceId: string,
    createManyDto: CreateManyTasksDto,
    userId: string
  ) {
    // Verify user has access to the workspace
    await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    // Verify all tasks belong to the same project for simplicity
    const projectIds = new Set(
      createManyDto.tasks.map((task) => task.projectId)
    );
    if (projectIds.size !== 1) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'MULTIPLE_PROJECTS_NOT_ALLOWED',
          'All tasks must belong to the same project'
        )
      );
    }

    const projectId = createManyDto.tasks[0].projectId;

    // Verify the project exists and belongs to this workspace
    await this.authorizationService.verifyProjectInWorkspace(
      projectId,
      workspaceId,
      userId
    );

    // Transform DTOs to Prisma input format
    const tasksData = createManyDto.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId,
      createdById: userId,
      ...(task.assignedToId && { assignedToId: task.assignedToId }),
      ...(task.sprintId && { sprintId: task.sprintId }),
    }));

    // Create tasks and get IDs
    const createdTasks = await this.tasksRepo.createManyAndReturn(tasksData);

    // Extract IDs and fetch complete tasks with relations
    const taskIds = createdTasks.map((task) => task.id);
    return this.tasksRepo.findByIds(taskIds);
  }
}
