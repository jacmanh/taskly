import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
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

  @IsString()
  @IsOptional()
  @MaxLength(500)
  context?: UpdateWorkspaceInput['context'];

  @IsEnum(DeleteStrategy)
  @IsOptional()
  deleteStrategy?: DeleteStrategy;
}
