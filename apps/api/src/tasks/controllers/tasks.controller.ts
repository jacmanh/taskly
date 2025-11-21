import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '@taskly/types';

@Controller('workspaces/:workspaceId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('projectId') projectId?: string,
    @Query('sprintId') sprintId?: string,
    @Query('assignedId') assignedId?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('includeArchived') includeArchived?: string
  ) {
    return this.tasksService.findByWorkspaceId(workspaceId, user.id, {
      projectId,
      sprintId,
      assignedId,
      status,
      priority,
      includeArchived: includeArchived === 'true',
    });
  }

  @Get(':id')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.tasksService.findOne(workspaceId, id, user.id);
  }

  @Post()
  create(
    @Param('workspaceId') workspaceId: string,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.tasksService.create(workspaceId, createTaskDto, user.id);
  }

  @Patch(':id')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.tasksService.update(workspaceId, id, updateTaskDto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.tasksService.remove(workspaceId, id, user.id);
  }
}
