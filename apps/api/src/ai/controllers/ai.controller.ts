import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { GenerateTasksDto } from '../dto/generate-tasks.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '@taskly/types';

@Controller('workspaces/:workspaceId/ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-tasks')
  generateTasks(
    @Param('workspaceId') workspaceId: string,
    @Body() generateTasksDto: GenerateTasksDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.aiService.generateTasks(
      workspaceId,
      generateTasksDto,
      user.id,
    );
  }
}
