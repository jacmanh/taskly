import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { AIProvider, GeneratedTaskBatch } from './ai.provider';
import { PromptLoader } from '../prompts/prompt-loader.service';

const TaskSuggestionSchema = z.object({
  batchTitle: z.string(),
  tasks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
    })
  ),
});

@Injectable()
export class OpenAiProvider extends AIProvider {
  private readonly client: OpenAI;
  private readonly logger = new Logger(OpenAiProvider.name);

  constructor(
    promptLoader: PromptLoader,
    private readonly configService: ConfigService
  ) {
    super(promptLoader);
    this.client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
  }

  protected async generate(
    systemPrompt: string,
    userPrompt: string
  ): Promise<GeneratedTaskBatch> {
    try {
      const completion = await this.client.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: zodResponseFormat(
          TaskSuggestionSchema,
          'task_suggestions'
        ),
      });

      const parsed = completion.choices[0]?.message?.parsed;

      if (!parsed) {
        this.logger.warn(
          'OpenAI returned no parsed output, returning empty batch'
        );
        return { batchTitle: 'Generated Tasks', tasks: [] };
      }

      return parsed as GeneratedTaskBatch;
    } catch (error) {
      this.logger.error('Failed to generate tasks via OpenAI', error);
      throw error;
    }
  }
}
