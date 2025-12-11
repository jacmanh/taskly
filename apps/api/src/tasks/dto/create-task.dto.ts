import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';
import { TaskStatus, TaskPriority, type CreateTaskInput } from '@taskly/types';

export class CreateTaskDto implements CreateTaskInput {
  @IsString()
  @IsNotEmpty()
  title: CreateTaskInput['title'];

  @IsString()
  @IsOptional()
  description?: CreateTaskInput['description'];

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: CreateTaskInput['status'];

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: CreateTaskInput['priority'];

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsString()
  @IsNotEmpty()
  projectId: CreateTaskInput['projectId'];

  @IsString()
  @IsOptional()
  assignedToId?: CreateTaskInput['assignedToId'];

  @IsString()
  @IsOptional()
  sprintId?: CreateTaskInput['sprintId'];
}
