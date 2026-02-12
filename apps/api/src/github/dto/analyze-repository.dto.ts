import { IsString, IsNotEmpty } from 'class-validator';

export class AnalyzeRepositoryDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  repo: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
