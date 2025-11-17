import { Injectable, NotFoundException, ForbiddenException, HttpStatus } from '@nestjs/common';
import { WorkspacesRepository } from '../repositories/workspaces.repository';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace.dto';
import { createApiError } from '../../common/errors/api-error.util';

@Injectable()
export class WorkspacesService {
  constructor(private repo: WorkspacesRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const workspace = await this.repo.findById(id);
    if (!workspace) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'WORKSPACE_NOT_FOUND',
          'Workspace not found.',
        ),
      );
    }
    return workspace;
  }

  async findByCurrentUser(userId: string) {
    return this.repo.findByOwnerId(userId);
  }

  async create(dto: CreateWorkspaceDto, ownerId: string) {
    // Generate slug from name
    const slug = this.generateSlug(dto.name);

    return this.repo.create({
      name: dto.name,
      slug,
      owner: {
        connect: { id: ownerId },
      },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD') // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  async update(id: string, dto: UpdateWorkspaceDto, userId: string) {
    const workspace = await this.findOne(id);

    // Verify user is the owner
    if (workspace.ownerId !== userId) {
      throw new ForbiddenException(
        createApiError(
          HttpStatus.FORBIDDEN,
          'WORKSPACE_UPDATE_DENIED',
          'You do not have permission to update this workspace.',
        ),
      );
    }

    return this.repo.update(id, dto);
  }

  async remove(id: string, userId: string) {
    const workspace = await this.findOne(id);

    // Verify user is the owner
    if (workspace.ownerId !== userId) {
      throw new ForbiddenException(
        createApiError(
          HttpStatus.FORBIDDEN,
          'WORKSPACE_DELETE_DENIED',
          'You do not have permission to delete this workspace.',
        ),
      );
    }

    return this.repo.delete(id);
  }
}
