import { Inject, Injectable } from '@nestjs/common';
import {
  AI_PROVIDER_TOKEN,
  AIProvider,
  GeneratedTask,
} from '../providers/ai.provider';
import { AuthorizationService } from '../../authorization/authorization.service';
import { GenerateTasksDto } from '../dto/generate-tasks.dto';

@Injectable()
export class AiService {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: AIProvider,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async generateTasks(
    workspaceId: string,
    dto: GenerateTasksDto,
    userId: string,
  ): Promise<GeneratedTask[]> {
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
