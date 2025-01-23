import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z, ZodError } from 'zod'

export const validateData =
  <Schema extends z.ZodType<any>>(schema: Schema) =>
  (
    req: Request<{}, {}, z.infer<Schema>>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Invalid data', details: errorMessages })
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' })
      }
    }
  }
