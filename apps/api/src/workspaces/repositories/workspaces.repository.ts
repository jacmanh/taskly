import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
}
