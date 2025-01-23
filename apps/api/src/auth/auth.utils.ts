import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { rateLimit } from 'express-rate-limit'
import jwt from 'jsonwebtoken'

export const generateToken = (user: User) => {
  return jwt.sign(
    { id: user.id, companyId: user.companyId },
    process.env.JWT_SECRET || '',
    {
      expiresIn: '1d',
    }
  )
}

export const arePasswordsEqual = async (
  password: string,
  hashPassword: string
) => {
  return bcrypt.compare(password, hashPassword)
}

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: {
    message: 'Too many requests, please try again later',
  },
})
