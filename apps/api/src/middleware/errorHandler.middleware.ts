import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: 'Unable to process request' })
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' })
    }
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' })
  }
}
