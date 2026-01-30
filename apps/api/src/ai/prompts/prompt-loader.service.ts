import { Injectable } from '@nestjs/common';
import {
  TASK_GENERATION_SYSTEM_PROMPT,
  TASK_GENERATION_USER_PROMPT_TEMPLATE,
} from './task-generation.prompts';

type PromptType = 'task-generation';

interface PromptTemplateVariables {
  workspaceName: string;
  workspaceContext?: string | null;
  projectName: string;
  projectDescription?: string | null;
  projectContext?: string | null;
  prompt: string;
  numberOfTasks?: number;
}

@Injectable()
export class PromptLoader {
  /**
   * Get the system prompt for a given prompt type
   */
  getSystemPrompt(type: PromptType): string {
    switch (type) {
      case 'task-generation':
        return TASK_GENERATION_SYSTEM_PROMPT;
      default:
        throw new Error(`Unknown prompt type: ${type}`);
    }
  }

  /**
   * Get the user prompt template and interpolate variables
   */
  getUserPrompt(type: PromptType, variables: PromptTemplateVariables): string {
    const template = this.getUserPromptTemplate(type);
    return this.interpolateTemplate(template, variables);
  }

  /**
   * Get the user prompt template for a given prompt type
   */
  private getUserPromptTemplate(type: PromptType): string {
    switch (type) {
      case 'task-generation':
        return TASK_GENERATION_USER_PROMPT_TEMPLATE;
      default:
        throw new Error(`Unknown prompt type: ${type}`);
    }
  }

  /**
   * Simple template interpolation without external dependencies
   * Supports {{variable}} syntax and conditional blocks
   * 
   * IMPORTANT: Processing order matters!
   * 1. Else-conditionals must be processed before non-else conditionals
   * 2. Conditionals must be processed before simple variables
   * 3. This prevents {{else}} from being incorrectly replaced as a variable
   */
  private interpolateTemplate(
    template: string,
    variables: PromptTemplateVariables,
  ): string {
    let result = template;

    // 1. Handle else blocks {{#if variable}}...{{else}}...{{/if}} FIRST
    // This must come before non-else conditionals to properly match blocks with else clauses
    result = result.replace(
      /\{\{#if (\w+)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, varName, ifContent, elseContent) => {
        const value = variables[varName as keyof PromptTemplateVariables];
        return value !== undefined && value !== null && value !== ''
          ? ifContent
          : elseContent;
      },
    );

    // 2. Handle conditional blocks {{#if variable}}...{{/if}} without else
    result = result.replace(
      /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, varName, content) => {
        const value = variables[varName as keyof PromptTemplateVariables];
        return value !== undefined && value !== null && value !== ''
          ? content
          : '';
      },
    );

    // 3. Replace simple variables {{variableName}} LAST
    // This ensures {{else}} isn't incorrectly treated as a variable
    result = result.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      const value = variables[varName as keyof PromptTemplateVariables];
      return value !== undefined && value !== null ? String(value) : '';
    });

    // Clean up any extra blank lines
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');

    return result.trim();
  }
}
