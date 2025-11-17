import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsGlobalController } from './controllers/projects-global.controller';
import { ProjectsService } from './services/projects.service';
import { ProjectsRepository } from './repositories/projects.repository';

@Module({
  imports: [PrismaModule, AuthorizationModule],
  controllers: [ProjectsController, ProjectsGlobalController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
