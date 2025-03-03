import {
  authenticate,
  AuthenticatedRequest,
} from '@api/auth/auth.middleware.js'
import {
  getTasksByAuthor,
  getTasksByCompany,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '@api/task/task.services.js'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()

// Get all tasks for the authenticated user (as author)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { userId, companyId } = req as AuthenticatedRequest
    const tasks = await getTasksByAuthor(userId, companyId)
    res.status(StatusCodes.OK).json(tasks)
  } catch (error) {
    next(error)
  }
})

// Get all tasks for the company
router.get('/company', authenticate, async (req, res, next) => {
  try {
    const { companyId } = req as AuthenticatedRequest
    const tasks = await getTasksByCompany(companyId)
    res.status(StatusCodes.OK).json(tasks)
  } catch (error) {
    next(error)
  }
})

// Get a specific task by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { companyId } = req as AuthenticatedRequest
    const { id } = req.params
    const task = await getTaskById(id, companyId)
    res.status(StatusCodes.OK).json(task)
  } catch (error) {
    next(error)
  }
})

// Create a new task
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { userId, companyId } = req as AuthenticatedRequest
    const taskData = {
      ...req.body,
      authorId: userId,
      companyId,
    }
    const task = await createTask(taskData)
    res.status(StatusCodes.CREATED).json(task)
  } catch (error) {
    next(error)
  }
})

// Update an existing task
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { companyId } = req as AuthenticatedRequest
    const { id } = req.params
    const task = await updateTask(id, companyId, req.body)
    res.status(StatusCodes.OK).json(task)
  } catch (error) {
    next(error)
  }
})

// Delete a task
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { companyId } = req as AuthenticatedRequest
    const { id } = req.params
    await deleteTask(id, companyId)
    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
})

export default router
