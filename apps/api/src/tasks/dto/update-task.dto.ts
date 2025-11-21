import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { TaskStatus, TaskPriority, type UpdateTaskInput } from '@taskly/types';

export class UpdateTaskDto implements UpdateTaskInput {
  @IsString()
  @IsOptional()
  title?: UpdateTaskInput['title'];

  @IsString()
  @IsOptional()
  description?: UpdateTaskInput['description'];

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: UpdateTaskInput['status'];

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: UpdateTaskInput['priority'];

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsString()
  @IsOptional()
  projectId?: UpdateTaskInput['projectId'];

  @IsString()
  @IsOptional()
  assignedId?: UpdateTaskInput['assignedId'];

  @IsString()
  @IsOptional()
  sprintId?: UpdateTaskInput['sprintId'];
}
