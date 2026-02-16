import { TaskPriority, TaskStatus } from '@taskly/types';
import { PromptLoader } from '../prompts/prompt-loader.service';

export interface GeneratedTask {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface GeneratedTaskBatch {
  batchTitle: string;
  tasks: GeneratedTask[];
}

export interface GenerateTasksContext {
  prompt: string;
  workspaceName: string;
  workspaceContext?: string | null;
  githubContext?: string | null;
  projectName: string;
  projectDescription?: string | null;
  projectContext?: string | null;
  numberOfTasks?: number;
}

export const AI_PROVIDER_TOKEN = Symbol('AI_PROVIDER_TOKEN');

export abstract class AIProvider {
  constructor(protected readonly promptLoader: PromptLoader) {}

  async generateTasks(
    context: GenerateTasksContext
  ): Promise<GeneratedTaskBatch> {
    const systemPrompt = this.promptLoader.getSystemPrompt('task-generation');
    const userPrompt = this.promptLoader.getUserPrompt(
      'task-generation',
      context
    );
    return this.generate(systemPrompt, userPrompt);
  }

  protected abstract generate(
    systemPrompt: string,
    userPrompt: string
  ): Promise<GeneratedTaskBatch>;
}
