import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private repo: WorkspacesRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const workspace = await this.repo.findById(id);
    if (!workspace) throw new NotFoundException(`Workspace ${id} not found`);
    return workspace;
  }

  async findByCurrentUser(userId: string) {
    return this.repo.findByOwnerId(userId);
  }

  async create(dto: CreateWorkspaceDto, ownerId: string) {
    // Business validation here
    return this.repo.create({
      name: dto.name,
      slug: dto.slug,
      color: dto.color,
      icon: dto.icon,
      owner: {
        connect: { id: ownerId },
      },
    });
  }

  async update(id: string, dto: UpdateWorkspaceDto) {
    await this.findOne(id); // Verify exists
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
