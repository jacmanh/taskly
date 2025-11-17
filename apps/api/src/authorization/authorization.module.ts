import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspacesRepository } from '../workspaces/repositories/workspaces.repository';
import { ProjectsRepository } from '../projects/repositories/projects.repository';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [PrismaModule],
  providers: [AuthorizationService, WorkspacesRepository, ProjectsRepository],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
