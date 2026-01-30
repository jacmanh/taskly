---
name: create-nestjs-module
description: Scaffold NestJS modules with 3-layer architecture (Controller, Service, Repository). Use when the user asks to create a module, add an endpoint, scaffold a route, or add CRUD functionality.
---

# Create NestJS Module

## Workflow

1. **Gather requirements:**
   - Resource name (singular, e.g., "comment", "tag")
   - CRUD operations needed (all or specific)
   - Relations to other entities

2. **Check for existing patterns** (DRY):
   - Shared utilities in `common/utils/` → reuse (slug, selects, etc.)
   - Similar services → reference patterns
   - Prisma select constants → use if available

3. **Create file structure:**
```
apps/api/src/{resources}/
├── controllers/{resource}.controller.ts
├── services/{resource}.service.ts
├── repositories/{resource}.repository.ts
├── dto/
│   ├── create-{resource}.dto.ts
│   └── update-{resource}.dto.ts
└── {resources}.module.ts
```

4. **Wire up in AppModule** if needed

## Templates

### Controller
```typescript
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { {Resource}Service } from '../services/{resource}.service';
import { Create{Resource}Dto } from '../dto/create-{resource}.dto';
import { Update{Resource}Dto } from '../dto/update-{resource}.dto';

@Controller('{resources}')
@UseGuards(JwtAuthGuard)
export class {Resource}Controller {
  constructor(private readonly service: {Resource}Service) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: Create{Resource}Dto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Update{Resource}Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

### Service
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { {Resource}Repository } from '../repositories/{resource}.repository';
import { Create{Resource}Dto } from '../dto/create-{resource}.dto';
import { Update{Resource}Dto } from '../dto/update-{resource}.dto';

@Injectable()
export class {Resource}Service {
  constructor(private readonly repository: {Resource}Repository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new NotFoundException(`{Resource} with ID ${id} not found`);
    }
    return item;
  }

  async create(dto: Create{Resource}Dto) {
    return this.repository.create(dto);
  }

  async update(id: string, dto: Update{Resource}Dto) {
    await this.findOne(id); // Verify exists
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id); // Verify exists
    return this.repository.delete(id);
  }
}
```

### Repository
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
// Import shared select constants if available
// import { USER_SELECT } from '../../common/utils/prisma-selects';

@Injectable()
export class {Resource}Repository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.{resource}.findMany();
  }

  findById(id: string) {
    return this.prisma.{resource}.findUnique({ where: { id } });
  }

  create(data: Prisma.{Resource}CreateInput) {
    return this.prisma.{resource}.create({ data });
  }

  update(id: string, data: Prisma.{Resource}UpdateInput) {
    return this.prisma.{resource}.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.{resource}.delete({ where: { id } });
  }
}
```

### Create DTO
```typescript
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class Create{Resource}Dto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
```

### Update DTO
```typescript
import { IsString, IsOptional } from 'class-validator';

export class Update{Resource}Dto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
```

### Module
```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { {Resource}Controller } from './controllers/{resource}.controller';
import { {Resource}Service } from './services/{resource}.service';
import { {Resource}Repository } from './repositories/{resource}.repository';

@Module({
  imports: [PrismaModule],
  controllers: [{Resource}Controller],
  providers: [{Resource}Service, {Resource}Repository],
  exports: [{Resource}Service],
})
export class {Resources}Module {}
```

## DRY Checklist

Before creating new code, check:
- [ ] Does `common/utils/slug.util.ts` exist? → Use for slug generation
- [ ] Does `common/utils/prisma-selects.ts` exist? → Use select constants
- [ ] Is there a similar utility in another service? → Extract to `common/utils/`
- [ ] Same Prisma include used 3+ times? → Create a constant

## Rules

- **Controller**: HTTP only, no business logic, no Prisma
- **Service**: Business logic only, no HTTP, no Prisma
- **Repository**: Prisma queries only, no business logic
- Use class-validator (NOT Zod) for DTOs
- Always verify entity exists before update/delete
- **Extract** repeated utilities to `common/utils/`
