import { HttpService } from '@app/front/core/httpService'
import { Task as PrismaTask, TaskStatus } from '@prisma/client'

export interface Task extends Omit<PrismaTask, 'createdAt' | 'updatedAt' | 'date'> {
  createdAt: Date
  updatedAt: Date
  date: Date | null
}

/**
 * Transforms date strings in a task to Date objects
 */
const transformTaskDates = (task: PrismaTask): Task => {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    date: task.date ? new Date(task.date) : null,
  }
}

/**
 * Task service for handling all task-related operations
 */
export class TaskService {
  /**
   * Get all tasks for the current user
   */
  static async getUserTasks(): Promise<Task[]> {
    const tasks = await HttpService.get<PrismaTask[]>('/api/task')
    return tasks.map(transformTaskDates)
  }

  /**
   * Get all tasks for the company
   */
  static async getCompanyTasks(): Promise<Task[]> {
    const tasks = await HttpService.get<PrismaTask[]>('/api/task/company')
    return tasks.map(transformTaskDates)
  }

  /**
   * Get a specific task by ID
   */
  static async getTaskById(id: string): Promise<Task> {
    const task = await HttpService.get<PrismaTask>(`/api/task/${id}`)
    return transformTaskDates(task)
  }

  /**
   * Update a task's status
   */
  static async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const task = await HttpService.put<PrismaTask>(`/api/task/${taskId}`, { status })
    return transformTaskDates(task)
  }
}
