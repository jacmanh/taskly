import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskDraftsService } from '../services/task-drafts.service';
import { UpdateDraftItemDto } from '../dto/update-draft-item.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '@taskly/types';

@Controller('workspaces/:workspaceId/task-drafts')
@UseGuards(JwtAuthGuard)
export class TaskDraftsController {
  constructor(private readonly taskDraftsService: TaskDraftsService) {}

  @Get()
  findBatches(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('projectId') projectId: string
  ) {
    return this.taskDraftsService.findBatchesByProject(
      workspaceId,
      projectId,
      user.id
    );
  }

  @Get(':batchId')
  findBatch(
    @Param('workspaceId') workspaceId: string,
    @Param('batchId') batchId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.taskDraftsService.findBatchById(workspaceId, batchId, user.id);
  }

  @Patch('items/:itemId')
  updateItem(
    @Param('workspaceId') workspaceId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateDraftItemDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.taskDraftsService.updateItem(workspaceId, itemId, dto, user.id);
  }

  @Post(':batchId/accept')
  acceptBatch(
    @Param('workspaceId') workspaceId: string,
    @Param('batchId') batchId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.taskDraftsService.acceptBatch(workspaceId, batchId, user.id);
  }

  @Post(':batchId/cancel')
  cancelBatch(
    @Param('workspaceId') workspaceId: string,
    @Param('batchId') batchId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.taskDraftsService.cancelBatch(workspaceId, batchId, user.id);
  }

  @Delete(':batchId')
  deleteBatch(
    @Param('workspaceId') workspaceId: string,
    @Param('batchId') batchId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.taskDraftsService.softDeleteBatch(
      workspaceId,
      batchId,
      user.id
    );
  }
}
