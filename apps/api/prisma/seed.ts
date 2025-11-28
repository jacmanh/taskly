import { PrismaClient, TaskStatus, TaskPriority, WorkspaceRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Prisma Seed Script for E2E Testing
 *
 * Creates consistent test data for Playwright e2e tests:
 * - Test user with known credentials
 * - Test workspace, project, and tasks
 * - All IDs prefixed with 'test-' for easy cleanup
 *
 * Usage:
 *   pnpm prisma db seed
 *
 * Or manually:
 *   tsx apps/api/prisma/seed.ts
 */

async function main() {
  console.log('🌱 Starting database seed...');

  // Delete existing test data (idempotent)
  console.log('🧹 Cleaning up existing test data...');
  await prisma.task.deleteMany({
    where: { id: { startsWith: 'test-' } },
  });
  await prisma.project.deleteMany({
    where: { id: { startsWith: 'test-' } },
  });
  await prisma.workspaceMember.deleteMany({
    where: {
      OR: [
        { workspaceId: { startsWith: 'test-' } },
        { userId: { startsWith: 'test-' } },
      ],
    },
  });
  await prisma.workspace.deleteMany({
    where: { id: { startsWith: 'test-' } },
  });
  await prisma.user.deleteMany({
    where: { id: { startsWith: 'test-' } },
  });

  // Create test user
  console.log('👤 Creating test user...');
  const hashedPassword = await bcrypt.hash('Test123!@#', 12);

  const testUser = await prisma.user.create({
    data: {
      id: 'test-user-id',
      email: 'test-user@taskly.com',
      password: hashedPassword,
      name: 'Test User',
      emailVerified: true,
      isActive: true,
    },
  });

  console.log(`✅ Created user: ${testUser.email} (${testUser.id})`);

  // Create test workspace
  console.log('🏢 Creating test workspace...');
  const testWorkspace = await prisma.workspace.create({
    data: {
      id: 'test-workspace-id',
      name: 'Test Workspace',
      slug: 'test-workspace',
      color: '#3B82F6',
      icon: '🧪',
      ownerId: testUser.id,
    },
  });

  console.log(`✅ Created workspace: ${testWorkspace.name} (${testWorkspace.id})`);

  // Create workspace membership (user is owner)
  console.log('👥 Creating workspace membership...');
  await prisma.workspaceMember.create({
    data: {
      workspaceId: testWorkspace.id,
      userId: testUser.id,
      role: WorkspaceRole.OWNER,
    },
  });

  console.log('✅ Added user as workspace owner');

  // Create test project
  console.log('📁 Creating test project...');
  const testProject = await prisma.project.create({
    data: {
      id: 'test-project-id',
      name: 'Test Project',
      slug: 'test-project',
      description: 'Project for E2E testing',
      color: '#10B981',
      icon: '📋',
      workspaceId: testWorkspace.id,
    },
  });

  console.log(`✅ Created project: ${testProject.name} (${testProject.id})`);

  // Create test tasks
  console.log('📝 Creating test tasks...');

  // Task 1: Basic task for inline edit testing
  const testTask = await prisma.task.create({
    data: {
      id: 'test-task-id',
      title: 'Original Task Title',
      description: 'Original description for testing inline edits',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: testProject.id,
      createdById: testUser.id,
    },
  });

  console.log(`✅ Created task: ${testTask.title} (${testTask.id})`);

  // Task 2: Task with all fields populated for comprehensive testing
  const testTaskWithAssignment = await prisma.task.create({
    data: {
      id: 'test-task-with-assignment-id',
      title: 'Task With Full Fields',
      description: 'This task has assignee, sprint, and due date for testing',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2025-12-31'),
      projectId: testProject.id,
      assignedId: testUser.id,
      sprintId: null, // No sprint for simplicity
      createdById: testUser.id,
    },
  });

  console.log(`✅ Created task: ${testTaskWithAssignment.title} (${testTaskWithAssignment.id})`);

  // Task 3: Completed task for testing different statuses
  const testTaskCompleted = await prisma.task.create({
    data: {
      id: 'test-task-completed-id',
      title: 'Completed Task',
      description: 'This task is already done',
      status: TaskStatus.DONE,
      priority: TaskPriority.LOW,
      projectId: testProject.id,
      createdById: testUser.id,
    },
  });

  console.log(`✅ Created task: ${testTaskCompleted.title} (${testTaskCompleted.id})`);

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: 1 (test-user@taskly.com / Test123!@#)`);
  console.log(`   - Workspaces: 1 (Test Workspace)`);
  console.log(`   - Projects: 1 (Test Project)`);
  console.log(`   - Tasks: 3 (test-task-id, test-task-with-assignment-id, test-task-completed-id)`);
  console.log('\n🔐 Test Credentials:');
  console.log(`   Email: test-user@taskly.com`);
  console.log(`   Password: Test123!@#`);
  console.log('\n🧪 Ready for E2E testing!');
}

main()
  .catch((e) => {
    console.error('❌ Seed script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
