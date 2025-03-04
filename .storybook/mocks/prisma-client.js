// Mock Prisma client for Storybook
export const TaskStatus = {
  todo: 'todo',
  in_progress: 'in_progress',
  done: 'done',
}

// Export empty PrismaClient to avoid errors
export const PrismaClient = function () {
  return {}
}

// Default export for compatibility
export default {
  TaskStatus,
  PrismaClient,
}
