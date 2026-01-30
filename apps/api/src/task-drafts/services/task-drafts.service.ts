import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { TaskDraftBatchStatus } from '@prisma/client';
import { TaskDraftsRepository } from '../repositories/task-drafts.repository';
import { TasksRepository } from '../../tasks/repositories/tasks.repository';
import { AuthorizationService } from '../../authorization/authorization.service';
import { UpdateDraftItemDto } from '../dto/update-draft-item.dto';
import { createApiError } from '../../common/errors/api-error.util';

@Injectable()
export class TaskDraftsService {
  constructor(
    private readonly taskDraftsRepo: TaskDraftsRepository,
    private readonly tasksRepo: TasksRepository,
    private readonly authorizationService: AuthorizationService
  ) {}

  async findBatchesByProject(
    workspaceId: string,
    projectId: string,
    userId: string
  ) {
    await this.authorizationService.verifyProjectInWorkspace(
      projectId,
      workspaceId,
      userId
    );

    return this.taskDraftsRepo.findBatchesByProjectId(projectId);
  }

  async findBatchById(workspaceId: string, batchId: string, userId: string) {
    await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    const batch = await this.taskDraftsRepo.findBatchById(batchId);
    if (!batch || batch.deletedAt) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'DRAFT_BATCH_NOT_FOUND',
          'Draft batch not found'
        )
      );
    }

    return batch;
  }

  async updateItem(
    workspaceId: string,
    itemId: string,
    dto: UpdateDraftItemDto,
    userId: string
  ) {
    await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    const item = await this.taskDraftsRepo.findItemById(itemId);
    if (!item) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'DRAFT_ITEM_NOT_FOUND',
          'Draft item not found'
        )
      );
    }

    return this.taskDraftsRepo.updateItem(itemId, {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.enabled !== undefined && { enabled: dto.enabled }),
    });
  }

  async acceptBatch(workspaceId: string, batchId: string, userId: string) {
    await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    const batch = await this.taskDraftsRepo.findBatchById(batchId);
    if (!batch || batch.deletedAt) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'DRAFT_BATCH_NOT_FOUND',
          'Draft batch not found'
        )
      );
    }

    if (batch.status !== TaskDraftBatchStatus.PENDING) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'BATCH_NOT_PENDING',
          'Only pending batches can be accepted'
        )
      );
    }

    const enabledItems = batch.items.filter((item) => item.enabled);
    if (enabledItems.length === 0) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'NO_ENABLED_ITEMS',
          'At least one item must be enabled to accept the batch'
        )
      );
    }

    const tasksData = enabledItems.map((item) => ({
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      projectId: batch.projectId,
      createdById: userId,
    }));

    await this.tasksRepo.createManyAndReturn(tasksData);
    await this.taskDraftsRepo.updateBatchStatus(
      batchId,
      TaskDraftBatchStatus.ACCEPTED
    );

    return { accepted: true, tasksCreated: enabledItems.length };
  }

  async cancelBatch(workspaceId: string, batchId: string, userId: string) {
    await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    const batch = await this.taskDraftsRepo.findBatchById(batchId);
    if (!batch || batch.deletedAt) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'DRAFT_BATCH_NOT_FOUND',
          'Draft batch not found'
        )
      );
    }

    if (batch.status !== TaskDraftBatchStatus.PENDING) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'BATCH_NOT_PENDING',
          'Only pending batches can be cancelled'
        )
      );
    }

    await this.taskDraftsRepo.updateBatchStatus(
      batchId,
      TaskDraftBatchStatus.CANCELLED
    );

    return { cancelled: true };
  }

  async softDeleteBatch(workspaceId: string, batchId: string, userId: string) {
    await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    const batch = await this.taskDraftsRepo.findBatchById(batchId);
    if (!batch || batch.deletedAt) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'DRAFT_BATCH_NOT_FOUND',
          'Draft batch not found'
        )
      );
    }

    return this.taskDraftsRepo.softDeleteBatch(batchId);
  }
}
