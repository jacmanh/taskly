import { TaskPriority, TaskStatus } from '@taskly/types';

export interface GeneratedTask {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface GenerateTasksContext {
  prompt: string;
  workspaceName: string;
  workspaceContext?: string | null;
  projectName: string;
  projectDescription?: string | null;
  projectContext?: string | null;
  numberOfTasks?: number;
}

export const AI_PROVIDER_TOKEN = Symbol('AI_PROVIDER_TOKEN');

export abstract class AIProvider {
  async generateTasks(context: GenerateTasksContext): Promise<GeneratedTask[]> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(context);
    return this.generate(systemPrompt, userPrompt);
  }

  protected abstract generate(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<GeneratedTask[]>;

  protected buildSystemPrompt(): string {
    return `You are a task generation assistant for a project management tool called Taskly.
Your job is to generate actionable, well-structured task suggestions based on workspace context, project context, and the user's request.

Rules:
- Each task must have a clear, concise title (max 100 characters)
- Each task must have a helpful description (1-3 sentences)
- Assign an appropriate priority: LOW, MEDIUM, or HIGH
- Set status to TODO for all generated tasks
- Tasks should be specific, actionable, and relevant to the user's request
- Avoid generic or vague tasks
- Use the workspace and project context to tailor tasks to the team's domain`;
  }

  protected buildUserPrompt(context: GenerateTasksContext): string {
    const parts: string[] = [];

    parts.push(`Workspace: "${context.workspaceName}"`);
    if (context.workspaceContext) {
      parts.push(`Workspace context: ${context.workspaceContext}`);
    }

    parts.push(`Project: "${context.projectName}"`);
    if (context.projectDescription) {
      parts.push(`Project description: ${context.projectDescription}`);
    }
    if (context.projectContext) {
      parts.push(`Project context: ${context.projectContext}`);
    }

    parts.push(`\nUser request: ${context.prompt}`);
    
    if (context.numberOfTasks) {
      // User explicitly requested a specific number of tasks
      parts.push(`\nGenerate exactly ${context.numberOfTasks} task suggestions.`);
    } else {
      // Let AI decide based on complexity
      parts.push(
        `\nAnalyze the request and generate an appropriate number of task suggestions (between 1-20 tasks).`,
      );
      parts.push(
        `The number of tasks should match the complexity and scope of the request.`,
      );
      parts.push(
        `For simple requests, generate fewer tasks. For complex projects, break them down into more granular tasks.`,
      );
    }

    return parts.join('\n');
  }
}
