import {
  authenticate,
  AuthenticatedRequest,
} from '@api/auth/auth.middleware.js'
import { getUserById } from '@api/user/user.services.js'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const router = Router()

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { userId, companyId } = req as AuthenticatedRequest
    const user = await getUserById(userId, companyId)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
})

export default router
