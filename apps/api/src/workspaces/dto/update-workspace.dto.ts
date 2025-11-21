import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UpdateWorkspaceInput, DeleteStrategy } from '@taskly/types';

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

  @IsEnum(DeleteStrategy)
  @IsOptional()
  deleteStrategy?: DeleteStrategy;
}
