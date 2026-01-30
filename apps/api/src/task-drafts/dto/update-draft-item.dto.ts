import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { TaskStatus, TaskPriority } from '@taskly/types';

export class UpdateDraftItemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
