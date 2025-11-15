import { IsString, IsOptional } from 'class-validator';
import type { UpdateWorkspaceInput } from '@taskly/types';

export class UpdateWorkspaceDto implements UpdateWorkspaceInput {
  @IsString()
  @IsOptional()
  name?: UpdateWorkspaceInput['name'];

  @IsString()
  @IsOptional()
  slug?: UpdateWorkspaceInput['slug'];

  @IsString()
  @IsOptional()
  color?: UpdateWorkspaceInput['color'];

  @IsString()
  @IsOptional()
  icon?: UpdateWorkspaceInput['icon'];
}
