import { Module } from '@nestjs/common';
import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';
import { AI_PROVIDER_TOKEN } from './providers/ai.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [AuthorizationModule],
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: AI_PROVIDER_TOKEN,
      useClass: OpenAiProvider,
    },
  ],
  exports: [AiService],
})
export class AiModule {}
