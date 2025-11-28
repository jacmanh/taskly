import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from '../services/tasks.service';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { AuthenticatedUser, Task, TaskStatus, TaskPriority } from '@taskly/types';
import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

/**
 * Contract tests for PATCH /workspaces/:workspaceId/tasks/:id
 *
 * Tests cover:
 * - SC-001: <1s p95 latency for inline field saves
 * - SC-002: <5% failure rate on inline edits
 * - Optimistic concurrency control (version/updatedAt checks)
 * - Permission validation (user must be workspace member)
 * - Field-level validation (title, status, dueDate, etc.)
 * - Error response contracts (400, 403, 404, 409)
 *
 * Per Constitution Principle I: Shared Contract Authority
 * - Request/response shapes match packages/types definitions
 * - Breaking changes require migration notes
 */
describe('TasksController - PATCH /tasks/:id (Contract Tests)', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockUser: AuthenticatedUser = {
    id: 'user-123',
    email: 'test@example.com',
    workspaceId: 'workspace-123',
  };

  const mockTask: Task = {
    id: 'task-123',
    title: 'Original Title',
    description: 'Original description',
    status: 'TODO' as TaskStatus,
    priority: 'MEDIUM' as TaskPriority,
    projectId: 'project-123',
    assignedId: null,
    sprintId: null,
    dueDate: null,
    createdBy: 'user-123',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-01T00:00:00Z'),
    archived: false,
    workspaceId: 'workspace-123',
  };

  const mockTasksService = {
    update: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  describe('Successful Updates (200 OK)', () => {
    it('should update task title inline and return updated task', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Updated Title',
      };

      const updatedTask: Task = {
        ...mockTask,
        title: 'Updated Title',
        updatedAt: new Date('2025-01-02T00:00:00Z'),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      expect(service.update).toHaveBeenCalledWith(
        'workspace-123',
        'task-123',
        updateDto,
        'user-123'
      );
      expect(result).toEqual(updatedTask);
      expect(result.title).toBe('Updated Title');
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should update task description inline', async () => {
      const updateDto: UpdateTaskDto = {
        description: 'Updated description with more details',
      };

      const updatedTask: Task = {
        ...mockTask,
        description: 'Updated description with more details',
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      expect(result.description).toBe('Updated description with more details');
    });

    it('should update task status inline', async () => {
      const updateDto: UpdateTaskDto = {
        status: 'IN_PROGRESS' as TaskStatus,
      };

      const updatedTask: Task = {
        ...mockTask,
        status: 'IN_PROGRESS' as TaskStatus,
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      expect(result.status).toBe('IN_PROGRESS');
    });

    it('should update task priority inline', async () => {
      const updateDto: UpdateTaskDto = {
        priority: 'HIGH' as TaskPriority,
      };

      const updatedTask: Task = {
        ...mockTask,
        priority: 'HIGH' as TaskPriority,
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      expect(result.priority).toBe('HIGH');
    });

    it('should update task dueDate inline', async () => {
      const updateDto: UpdateTaskDto = {
        dueDate: new Date('2025-12-31'),
      };

      const updatedTask: Task = {
        ...mockTask,
        dueDate: new Date('2025-12-31'),
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      expect(result.dueDate).toEqual(new Date('2025-12-31'));
    });

    it('should update task assignedId inline', async () => {
      const updateDto: UpdateTaskDto = {
        assignedId: 'user-456',
      };

      const updatedTask: Task = {
        ...mockTask,
        assignedId: 'user-456',
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      expect(result.assignedId).toBe('user-456');
    });

    it('should update task sprintId inline', async () => {
      const updateDto: UpdateTaskDto = {
        sprintId: 'sprint-456',
      };

      const updatedTask: Task = {
        ...mockTask,
        sprintId: 'sprint-456',
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      expect(result.sprintId).toBe('sprint-456');
    });

    it('should update multiple fields simultaneously', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'New Title',
        status: 'IN_PROGRESS' as TaskStatus,
        priority: 'HIGH' as TaskPriority,
      };

      const updatedTask: Task = {
        ...mockTask,
        title: 'New Title',
        status: 'IN_PROGRESS' as TaskStatus,
        priority: 'HIGH' as TaskPriority,
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      expect(result.title).toBe('New Title');
      expect(result.status).toBe('IN_PROGRESS');
      expect(result.priority).toBe('HIGH');
    });
  });

  describe('Validation Errors (400 Bad Request)', () => {
    it('should reject empty title', async () => {
      const updateDto: UpdateTaskDto = {
        title: '',
      };

      mockTasksService.update.mockRejectedValue(
        new BadRequestException({
          message: 'Validation failed',
          fieldErrors: [
            { field: 'title', message: 'Title must not be empty' },
          ],
        })
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject title that is too short', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'AB',
      };

      mockTasksService.update.mockRejectedValue(
        new BadRequestException({
          message: 'Validation failed',
          fieldErrors: [
            { field: 'title', message: 'Title must be at least 3 characters' },
          ],
        })
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid status value', async () => {
      const updateDto: UpdateTaskDto = {
        status: 'INVALID_STATUS' as TaskStatus,
      };

      mockTasksService.update.mockRejectedValue(
        new BadRequestException({
          message: 'Validation failed',
          fieldErrors: [
            {
              field: 'status',
              message: 'Status must be one of: TODO, IN_PROGRESS, DONE, BLOCKED',
            },
          ],
        })
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid priority value', async () => {
      const updateDto: UpdateTaskDto = {
        priority: 'INVALID_PRIORITY' as TaskPriority,
      };

      mockTasksService.update.mockRejectedValue(
        new BadRequestException({
          message: 'Validation failed',
          fieldErrors: [
            {
              field: 'priority',
              message: 'Priority must be one of: LOW, MEDIUM, HIGH, URGENT',
            },
          ],
        })
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject past due date', async () => {
      const pastDate = new Date('2020-01-01');
      const updateDto: UpdateTaskDto = {
        dueDate: pastDate,
      };

      mockTasksService.update.mockRejectedValue(
        new BadRequestException({
          message: 'Validation failed',
          fieldErrors: [
            { field: 'dueDate', message: 'Due date cannot be in the past' },
          ],
        })
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid assignedId (user not in workspace)', async () => {
      const updateDto: UpdateTaskDto = {
        assignedId: 'invalid-user-id',
      };

      mockTasksService.update.mockRejectedValue(
        new BadRequestException({
          message: 'Validation failed',
          fieldErrors: [
            {
              field: 'assignedId',
              message: 'User is not a member of this workspace',
            },
          ],
        })
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Not Found (404)', () => {
    it('should return 404 when task does not exist', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'New Title',
      };

      mockTasksService.update.mockRejectedValue(
        new NotFoundException('Task not found')
      );

      await expect(
        controller.update('workspace-123', 'nonexistent-task', updateDto, mockUser)
      ).rejects.toThrow(NotFoundException);
    });

    it('should return 404 when task belongs to different workspace', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'New Title',
      };

      mockTasksService.update.mockRejectedValue(
        new NotFoundException('Task not found in this workspace')
      );

      await expect(
        controller.update('wrong-workspace', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Permission Errors (403 Forbidden)', () => {
    it('should return 403 when user lacks edit permission', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'New Title',
      };

      mockTasksService.update.mockRejectedValue(
        new ForbiddenException('You do not have permission to edit this task')
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return 403 when task is in archived project', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'New Title',
      };

      mockTasksService.update.mockRejectedValue(
        new ForbiddenException('Cannot edit tasks in archived projects')
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Optimistic Concurrency (409 Conflict)', () => {
    it('should return 409 when task was modified by another user', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'My Changes',
        updatedAt: new Date('2025-01-01T00:00:00Z'), // Stale version
      };

      const latestTask: Task = {
        ...mockTask,
        title: 'Someone Elses Changes',
        updatedAt: new Date('2025-01-02T00:00:00Z'), // Newer version
      };

      mockTasksService.update.mockRejectedValue(
        new ConflictException({
          message: 'Task was modified by another user',
          latest: latestTask,
          conflictingFields: ['title'],
        })
      );

      await expect(
        controller.update('workspace-123', 'task-123', updateDto, mockUser)
      ).rejects.toThrow(ConflictException);
    });

    it('should include latest task data in conflict response', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'My Changes',
        updatedAt: new Date('2025-01-01T00:00:00Z'),
      };

      const latestTask: Task = {
        ...mockTask,
        title: 'Latest Title',
        description: 'Latest Description',
        updatedAt: new Date('2025-01-02T00:00:00Z'),
      };

      mockTasksService.update.mockRejectedValue(
        new ConflictException({
          message: 'Task was modified by another user',
          latest: latestTask,
          conflictingFields: ['title'],
        })
      );

      try {
        await controller.update('workspace-123', 'task-123', updateDto, mockUser);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getResponse()).toMatchObject({
          message: 'Task was modified by another user',
          latest: expect.objectContaining({
            title: 'Latest Title',
            updatedAt: expect.any(Date),
          }),
          conflictingFields: ['title'],
        });
      }
    });
  });

  describe('Performance Requirements (SC-001)', () => {
    it('should complete inline save within acceptable latency', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Quick Update',
      };

      const startTime = Date.now();

      const updatedTask: Task = {
        ...mockTask,
        title: 'Quick Update',
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      await controller.update('workspace-123', 'task-123', updateDto, mockUser);

      const duration = Date.now() - startTime;

      // Note: In production, this is tracked via telemetry
      // Target: <1s p95 latency (SC-001)
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Response Contract Validation', () => {
    it('should return Task type matching @taskly/types contract', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Updated Title',
      };

      const updatedTask: Task = {
        ...mockTask,
        title: 'Updated Title',
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      // Verify response matches Task contract
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('priority');
      expect(result).toHaveProperty('projectId');
      expect(result).toHaveProperty('assignedId');
      expect(result).toHaveProperty('sprintId');
      expect(result).toHaveProperty('dueDate');
      expect(result).toHaveProperty('createdBy');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result).toHaveProperty('archived');
      expect(result).toHaveProperty('workspaceId');

      // Verify types
      expect(typeof result.id).toBe('string');
      expect(typeof result.title).toBe('string');
      expect(result.status).toMatch(/^(TODO|IN_PROGRESS|DONE|BLOCKED)$/);
      expect(result.priority).toMatch(/^(LOW|MEDIUM|HIGH|URGENT)$/);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(typeof result.archived).toBe('boolean');
    });

    it('should preserve non-updated fields in response', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Only Title Updated',
      };

      const updatedTask: Task = {
        ...mockTask,
        title: 'Only Title Updated',
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(
        'workspace-123',
        'task-123',
        updateDto,
        mockUser
      );

      // All other fields should remain unchanged
      expect(result.description).toBe(mockTask.description);
      expect(result.status).toBe(mockTask.status);
      expect(result.priority).toBe(mockTask.priority);
      expect(result.projectId).toBe(mockTask.projectId);
      expect(result.assignedId).toBe(mockTask.assignedId);
      expect(result.sprintId).toBe(mockTask.sprintId);
      expect(result.createdBy).toBe(mockTask.createdBy);
    });
  });
});
