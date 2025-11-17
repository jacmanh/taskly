import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { workspace: true },
    });
  }

  findByWorkspaceId(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByUserId(userId: string) {
    return this.prisma.project.findMany({
      where: {
        workspace: {
          ownerId: userId,
        },
      },
      include: { workspace: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: Prisma.ProjectCreateInput) {
    return this.prisma.project.create({
      data,
      include: { workspace: true },
    });
  }

  update(id: string, data: Prisma.ProjectUpdateInput) {
    return this.prisma.project.update({
      where: { id },
      data,
      include: { workspace: true },
    });
  }

  delete(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
