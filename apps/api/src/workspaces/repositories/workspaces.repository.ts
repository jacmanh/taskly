import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { WorkspaceUserMapper } from '../mappers/workspace-user.mapper';

@Injectable()
export class WorkspacesRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.workspace.findMany();
  }

  findById(id: string) {
    return this.prisma.workspace.findUnique({ where: { id } });
  }

  findByOwnerId(ownerId: string) {
    return this.prisma.workspace.findMany({
      where: { ownerId },
    });
  }

  create(data: Prisma.WorkspaceCreateInput) {
    return this.prisma.workspace.create({ data });
  }

  update(id: string, data: Prisma.WorkspaceUpdateInput) {
    return this.prisma.workspace.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.workspace.delete({ where: { id } });
  }

  findMemberByUserAndWorkspace(workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  }

  async findWorkspaceUsers(workspaceId: string, search?: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: {
        workspaceId,
        ...(search && {
          user: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return WorkspaceUserMapper.toUsers(members);
  }
}
