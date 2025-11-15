# Prisma Schema - Naming Conventions & Best Practices

## Stack
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Project**: Nx monorepo, schemas in `apps/api/prisma/schema/`

## Naming Conventions

### Model Names (ORM side)

**Format**: PascalCase, Singular

```prisma
model User {        // ✅ Singular, PascalCase
model Workspace {   // ✅ Singular, PascalCase
model Project {     // ✅ Singular, PascalCase
```

**❌ Wrong:**
```prisma
model Users {       // ❌ Plural
model user {        // ❌ lowercase
model workspace_member { // ❌ snake_case
```

### Table Names (Database side)

**Format**: snake_case, Plural, mapped with `@@map()`

```prisma
model User {
  // ... fields
  @@map("users")  // ✅ Plural, snake_case
}

model Workspace {
  // ... fields
  @@map("workspaces")  // ✅ Plural, snake_case
}

model WorkspaceMember {
  // ... fields
  @@map("workspace_members")  // ✅ Plural, snake_case with underscore
}
```

**❌ Wrong:**
```prisma
@@map("User")           // ❌ PascalCase
@@map("workspace")      // ❌ Singular
@@map("WorkspaceMembers") // ❌ PascalCase
```

## Complete Example

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?

  ownedWorkspaces Workspace[] @relation("WorkspaceOwner")
  memberships     WorkspaceMember[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")  // ✅ Table name: users (plural, snake_case)
}

model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique

  ownerId   String
  owner     User     @relation("WorkspaceOwner", fields: [ownerId], references: [id])

  members   WorkspaceMember[]
  projects  Project[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("workspaces")  // ✅ Table name: workspaces
}

model WorkspaceMember {
  id          String        @id @default(cuid())

  workspaceId String
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  role        WorkspaceRole @default(MEMBER)

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@unique([workspaceId, userId])
  @@map("workspace_members")  // ✅ Table name: workspace_members
}
```

## Field Naming

### Regular Fields
**Format**: camelCase

```prisma
name        String   // ✅
createdAt   DateTime // ✅
workspaceId String   // ✅
```

**❌ Wrong:**
```prisma
workspace_id String  // ❌ snake_case
WorkspaceId  String  // ❌ PascalCase
```

### Foreign Keys
**Convention**: `{modelName}Id` (camelCase)

```prisma
workspaceId String      // ✅ Reference field
workspace   Workspace   // ✅ Relation field
```

### Relation Fields
**Convention**: Same as model name (singular for one-to-one, plural for one-to-many)

```prisma
model User {
  ownedWorkspaces Workspace[]       // ✅ Plural for array
  memberships     WorkspaceMember[] // ✅ Plural for array
}

model Workspace {
  owner User @relation(...)  // ✅ Singular for single relation
}
```

## Enum Naming

**Format**: PascalCase for enum name, SCREAMING_SNAKE_CASE for values

```prisma
enum WorkspaceRole {  // ✅ PascalCase
  OWNER               // ✅ SCREAMING_SNAKE_CASE
  ADMIN
  MEMBER
  GUEST
}
```

**❌ Wrong:**
```prisma
enum workspace_role {  // ❌ snake_case
  owner                // ❌ lowercase
  Admin                // ❌ PascalCase
}
```

## Common Patterns

### Timestamps
```prisma
createdAt  DateTime  @default(now())
updatedAt  DateTime  @updatedAt
archivedAt DateTime? // Optional for soft delete
```

### IDs
```prisma
id String @id @default(cuid())  // ✅ Preferred for distributed systems
id String @id @default(uuid())  // ✅ Alternative
id Int    @id @default(autoincrement())  // ✅ For simple cases
```

### Unique Constraints
```prisma
email String @unique  // Single field

@@unique([workspaceId, slug])  // Composite unique
```

### Cascade Delete
```prisma
workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
```

## Summary Table

| Element | ORM Side | DB Side | Example |
|---------|----------|---------|---------|
| **Model** | PascalCase, Singular | snake_case, Plural | `User` → `users` |
| **Field** | camelCase | - | `createdAt` |
| **Foreign Key** | camelCase + Id | - | `workspaceId` |
| **Relation** | camelCase | - | `workspace` / `projects` |
| **Enum** | PascalCase | - | `WorkspaceRole` |
| **Enum Value** | SCREAMING_SNAKE_CASE | - | `ADMIN` |

## Rules to Follow

**✅ Always do:**
- Use `@@map()` on every model to map to plural snake_case table name
- Keep model names singular and in PascalCase
- Use camelCase for all fields
- Use CUID or UUID for distributed IDs
- Add timestamps (`createdAt`, `updatedAt`)

**❌ Never do:**
- Use plural model names in Prisma schema
- Use snake_case or PascalCase for table names without `@@map()`
- Mix naming conventions
- Skip `@@map()` (even if model name matches table name by coincidence)

## Migration Commands

```bash
# Create migration after schema changes
npx prisma migrate dev --name descriptive_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```
