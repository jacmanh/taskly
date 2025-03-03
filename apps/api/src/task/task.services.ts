import db from '@api/db.js'
import { Prisma } from '@prisma/client'

/**
 * Get all tasks for a specific author
 */
export const getTasksByAuthor = async (authorId: string, companyId: string) => {
  return db.task.findMany({
    where: {
      authorId,
      companyId,
    },
    orderBy: {
      date: 'desc',
    },
  })
}

/**
 * Get all tasks assigned to a specific user
 */
export const getTasksByAssignee = async (assigneeId: string, companyId: string) => {
  return db.task.findMany({
    where: {
      assigneeId,
      companyId,
    },
    orderBy: {
      date: 'desc',
    },
  })
}

/**
 * Get all tasks for a company
 */
export const getTasksByCompany = async (companyId: string) => {
  return db.task.findMany({
    where: {
      companyId,
    },
    orderBy: {
      date: 'desc',
    },
  })
}

/**
 * Get a task by ID
 */
export const getTaskById = async (id: string, companyId: string) => {
  const task = await db.task.findUnique({
    where: {
      id,
      companyId,
    },
  })

  if (!task) {
    throw new Error('Task not found')
  }

  return task
}

/**
 * Create a new task
 */
export const createTask = async (data: Prisma.TaskCreateInput) => {
  // Ensure date is a Date object if not provided
  if (!data.date) {
    data.date = new Date()
  }
  
  return db.task.create({
    data,
  })
}

/**
 * Update an existing task
 */
export const updateTask = async (id: string, companyId: string, data: Prisma.TaskUpdateInput) => {
  return db.task.update({
    where: {
      id,
      companyId,
    },
    data,
  })
}

/**
 * Delete a task
 */
export const deleteTask = async (id: string, companyId: string) => {
  return db.task.delete({
    where: {
      id,
      companyId,
    },
  })
}
