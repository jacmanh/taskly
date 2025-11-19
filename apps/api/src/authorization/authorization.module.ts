import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspacesRepository } from '../workspaces/repositories/workspaces.repository';
import { ProjectsRepository } from '../projects/repositories/projects.repository';
import { TasksRepository } from '../tasks/repositories/tasks.repository';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [PrismaModule],
  providers: [
    AuthorizationService,
    WorkspacesRepository,
    ProjectsRepository,
    TasksRepository,
  ],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
