import { IsString, IsNotEmpty } from 'class-validator';
import type { CreateWorkspaceInput } from '@taskly/types';

export class CreateWorkspaceDto implements CreateWorkspaceInput {
  @IsString()
  @IsNotEmpty()
  name: CreateWorkspaceInput['name'];
}
