import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class GenerateTasksDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  prompt: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(20)
  numberOfTasks?: number; // Optional: Override AI's decision on task count (rarely used)
}
