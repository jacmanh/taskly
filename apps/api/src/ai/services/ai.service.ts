import { Inject, Injectable } from '@nestjs/common';
import {
  AI_PROVIDER_TOKEN,
  AIProvider,
} from '../providers/ai.provider';
import { AuthorizationService } from '../../authorization/authorization.service';
import { TaskDraftsRepository } from '../../task-drafts/repositories/task-drafts.repository';
import { GenerateTasksDto } from '../dto/generate-tasks.dto';

@Injectable()
export class AiService {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: AIProvider,
    private readonly authorizationService: AuthorizationService,
    private readonly taskDraftsRepo: TaskDraftsRepository,
  ) {}

  async generateTasks(
    workspaceId: string,
    dto: GenerateTasksDto,
    userId: string,
  ) {
    const result = await this.generate(workspaceId, dto, userId);

    const batch = await this.taskDraftsRepo.createBatchWithItems({
      title: result.batchTitle,
      prompt: dto.prompt,
      projectId: dto.projectId,
      creatorId: userId,
      items: result.tasks,
    });

    return batch;
  }

  async regenerateBatch(
    workspaceId: string,
    batchId: string,
    dto: GenerateTasksDto,
    userId: string,
  ) {
    const result = await this.generate(workspaceId, dto, userId);

    // Delete old items and create new ones, update batch prompt/title
    await this.taskDraftsRepo.deleteItemsByBatchId(batchId);
    await this.taskDraftsRepo.createItems(batchId, result.tasks);
    const batch = await this.taskDraftsRepo.updateBatch(batchId, {
      title: result.batchTitle,
      prompt: dto.prompt,
    });

    return batch;
  }

  private async generate(
    workspaceId: string,
    dto: GenerateTasksDto,
    userId: string,
  ) {
    const workspace =
      await this.authorizationService.verifyWorkspaceAccess(workspaceId, userId);

    const project =
      await this.authorizationService.verifyProjectInWorkspace(
        dto.projectId,
        workspaceId,
        userId,
      );

    return this.aiProvider.generateTasks({
      prompt: dto.prompt,
      workspaceName: workspace.name,
      workspaceContext: workspace.context,
      projectName: project.name,
      projectDescription: project.description,
      projectContext: project.context,
      numberOfTasks: dto.numberOfTasks,
    });
  }
}
