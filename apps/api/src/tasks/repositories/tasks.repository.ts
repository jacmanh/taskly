import { Injectable } from '@nestjs/common';
import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        sprint: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    if (task?.deletedAt) {
      return null;
    }
    return task;
  }

  findByWorkspaceId(
    workspaceId: string,
    filters?: {
      projectId?: string;
      sprintId?: string;
      assignedToId?: string;
      status?: string;
      priority?: string;
      includeArchived?: boolean;
    }
  ) {
    const where: Prisma.TaskWhereInput = {
      project: {
        workspaceId,
      },
    };

    if (!filters?.includeArchived) {
      where.deletedAt = null;
    }

    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters?.sprintId) {
      where.sprintId = filters.sprintId;
    }

    if (filters?.assignedToId) {
      where.assignedTo = {
        id: filters.assignedToId,
      };
    }

    if (filters?.status) {
      where.status = filters.status as TaskStatus;
    }

    if (filters?.priority) {
      where.priority = filters.priority as TaskPriority;
    }

    return this.prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        sprint: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({
      data,
      include: {
        project: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        sprint: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  update(id: string, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        project: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        sprint: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  archive(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        description: null,
      },
      include: {
        project: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        sprint: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  delete(id: string) {
    return this.prisma.task.delete({
      where: { id },
      include: {
        project: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        sprint: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }
}
