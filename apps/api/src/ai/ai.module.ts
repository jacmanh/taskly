import { Module } from '@nestjs/common';
import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';
import { AI_PROVIDER_TOKEN } from './providers/ai.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { PromptLoader } from './prompts/prompt-loader.service';
import { AuthorizationModule } from '../authorization/authorization.module';
import { TaskDraftsModule } from '../task-drafts/task-drafts.module';

@Module({
  imports: [AuthorizationModule, TaskDraftsModule],
  controllers: [AiController],
  providers: [
    AiService,
    PromptLoader,
    {
      provide: AI_PROVIDER_TOKEN,
      useClass: OpenAiProvider,
    },
  ],
  exports: [AiService],
})
export class AiModule {}
