import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import type { CreateWorkspaceInput } from '@taskly/types';

export class CreateWorkspaceDto implements CreateWorkspaceInput {
  @IsString()
  @IsNotEmpty()
  name: CreateWorkspaceInput['name'];

  @IsString()
  @IsNotEmpty()
  slug: CreateWorkspaceInput['slug'];

  @IsString()
  @IsOptional()
  color?: CreateWorkspaceInput['color'];

  @IsString()
  @IsOptional()
  icon?: CreateWorkspaceInput['icon'];
}
