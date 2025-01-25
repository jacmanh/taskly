import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

const secretKey = process.env.JWT_SECRET || 'secret'

export interface AuthenticatedRequest extends Request {
  userId: string
  companyId: string
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | null = null

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token && req.cookies?.auth_token) {
      token = req.cookies.auth_token
    }

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
      return
    }

    const decoded = jwt.verify(token, secretKey) as {
      id: string
      companyId: string
    }

    if (!decoded.id || !decoded.companyId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' })
      return
    }

    ;(req as AuthenticatedRequest).userId = decoded.id
    ;(req as AuthenticatedRequest).companyId = decoded.companyId

    next()
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid or expired token' })
    return
  }
}
