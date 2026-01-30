import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import type { CreateWorkspaceInput } from '@taskly/types';

export class CreateWorkspaceDto implements CreateWorkspaceInput {
  @IsString()
  @IsNotEmpty()
  name: CreateWorkspaceInput['name'];

  @IsString()
  @IsOptional()
  @MaxLength(500)
  context?: CreateWorkspaceInput['context'];
}
