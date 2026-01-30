import { Injectable } from '@nestjs/common';
import {
  Prisma,
  TaskDraftBatchStatus,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TaskDraftsRepository {
  constructor(private prisma: PrismaService) {}

  findBatchesByProjectId(projectId: string) {
    return this.prisma.taskDraftBatch.findMany({
      where: { projectId, deletedAt: null },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findBatchById(id: string) {
    return this.prisma.taskDraftBatch.findUnique({
      where: { id },
      include: {
        items: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  createBatchWithItems(data: {
    title: string;
    prompt: string;
    projectId: string;
    creatorId: string;
    items: { title: string; description?: string; priority: TaskPriority; status: TaskStatus }[];
  }) {
    return this.prisma.taskDraftBatch.create({
      data: {
        title: data.title,
        prompt: data.prompt,
        project: { connect: { id: data.projectId } },
        creator: { connect: { id: data.creatorId } },
        items: {
          create: data.items.map((item) => ({
            title: item.title,
            description: item.description,
            status: item.status,
            priority: item.priority,
          })),
        },
      },
      include: {
        items: { orderBy: { createdAt: 'asc' } },
        _count: { select: { items: true } },
      },
    });
  }

  updateBatchStatus(id: string, status: TaskDraftBatchStatus) {
    return this.prisma.taskDraftBatch.update({
      where: { id },
      data: { status },
      include: {
        items: { orderBy: { createdAt: 'asc' } },
        _count: { select: { items: true } },
      },
    });
  }

  updateBatch(id: string, data: Prisma.TaskDraftBatchUpdateInput) {
    return this.prisma.taskDraftBatch.update({
      where: { id },
      data,
      include: {
        items: { orderBy: { createdAt: 'asc' } },
        _count: { select: { items: true } },
      },
    });
  }

  findItemById(id: string) {
    return this.prisma.taskDraftItem.findUnique({
      where: { id },
      include: { batch: true },
    });
  }

  updateItem(id: string, data: Prisma.TaskDraftItemUpdateInput) {
    return this.prisma.taskDraftItem.update({
      where: { id },
      data,
    });
  }

  deleteItemsByBatchId(batchId: string) {
    return this.prisma.taskDraftItem.deleteMany({
      where: { batchId },
    });
  }

  createItems(
    batchId: string,
    items: { title: string; description?: string; priority: TaskPriority; status: TaskStatus }[],
  ) {
    return this.prisma.taskDraftItem.createMany({
      data: items.map((item) => ({
        batchId,
        title: item.title,
        description: item.description,
        status: item.status,
        priority: item.priority,
      })),
    });
  }

  softDeleteBatch(id: string) {
    return this.prisma.taskDraftBatch.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
