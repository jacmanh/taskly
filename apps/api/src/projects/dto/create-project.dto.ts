import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import type { CreateProjectInput } from '@taskly/types';

export class CreateProjectDto implements CreateProjectInput {
  @IsString()
  @IsNotEmpty()
  name: CreateProjectInput['name'];

  @IsString()
  @IsOptional()
  description?: CreateProjectInput['description'];

  @IsString()
  @IsOptional()
  @MaxLength(500)
  context?: CreateProjectInput['context'];
}
