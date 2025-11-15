# NestJS Architecture - Taskly Project

## Stack
- **NestJS**: 11.1.8
- **Database**: Prisma ORM
- **Validation**: class-validator (NOT Zod)
- **Monorepo**: Nx workspace, API in `apps/api`

## Architecture: 3-Layer Pattern

```
Controller → Service → Repository → Prisma
```

**Rules:**
- Controllers: ONLY handle HTTP (no business logic, no Prisma)
- Services: ONLY business logic (no HTTP, no Prisma)
- Repositories: ONLY Prisma queries (no business logic)

## File Structure

```
apps/api/src/[domain]/
├── controllers/[domain].controller.ts
├── services/[domain].service.ts
├── repositories/[domain].repository.ts
├── dto/
│   ├── create-[domain].dto.ts
│   └── update-[domain].dto.ts
└── [domain].module.ts
```

## Templates

### Controller
```typescript
@Controller('resources')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() dto: CreateResourceDto) { return this.service.create(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
```

### Service
```typescript
@Injectable()
export class ResourceService {
  constructor(private repo: ResourceRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException(`Resource ${id} not found`);
    return item;
  }

  async create(dto: CreateResourceDto) {
    // Business validation here
    return this.repo.create(dto);
  }

  async update(id: string, dto: UpdateResourceDto) {
    await this.findOne(id); // Verify exists
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.delete(id);
  }
}
```

### Repository
```typescript
@Injectable()
export class ResourceRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.resource.findMany();
  }

  findById(id: string) {
    return this.prisma.resource.findUnique({ where: { id } });
  }

  create(data: Prisma.ResourceCreateInput) {
    return this.prisma.resource.create({ data });
  }

  update(id: string, data: Prisma.ResourceUpdateInput) {
    return this.prisma.resource.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.resource.delete({ where: { id } });
  }
}
```

### DTOs (class-validator)
```typescript
export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateResourceDto {
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
@Module({
  imports: [PrismaModule],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository],
  exports: [ResourceService],
})
export class ResourceModule {}
```

## Rules to Follow

**❌ Never do:**
- Business logic in controllers
- Prisma in controllers or services (ONLY in repositories)
- Skip validation before update/delete
- Use `any` types

**✅ Always do:**
- Controller → Service → Repository → Prisma
- Validate with class-validator in DTOs
- Check if entity exists before update/delete
- Keep each layer focused on ONE responsibility
