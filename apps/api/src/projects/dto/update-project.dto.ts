import { IsString, IsOptional, MaxLength } from 'class-validator';
import type { UpdateProjectInput } from '@taskly/types';

export class UpdateProjectDto implements UpdateProjectInput {
  @IsString()
  @IsOptional()
  name?: UpdateProjectInput['name'];

  @IsString()
  @IsOptional()
  description?: UpdateProjectInput['description'];

  @IsString()
  @IsOptional()
  color?: UpdateProjectInput['color'];

  @IsString()
  @IsOptional()
  icon?: UpdateProjectInput['icon'];

  @IsString()
  @IsOptional()
  @MaxLength(500)
  context?: UpdateProjectInput['context'];
}
