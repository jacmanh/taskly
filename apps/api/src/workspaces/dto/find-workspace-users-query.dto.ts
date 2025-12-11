import { IsString, IsOptional } from 'class-validator';

export class FindWorkspaceUsersQueryDto {
  @IsString()
  @IsOptional()
  search?: string;
}
