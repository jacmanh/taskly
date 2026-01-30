import { Module } from '@nestjs/common';
import { TaskDraftsService } from './services/task-drafts.service';
import { TaskDraftsController } from './controllers/task-drafts.controller';
import { TaskDraftsRepository } from './repositories/task-drafts.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthorizationModule } from '../authorization/authorization.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [PrismaModule, AuthorizationModule, TasksModule],
  controllers: [TaskDraftsController],
  providers: [TaskDraftsService, TaskDraftsRepository],
  exports: [TaskDraftsService, TaskDraftsRepository],
})
export class TaskDraftsModule {}
