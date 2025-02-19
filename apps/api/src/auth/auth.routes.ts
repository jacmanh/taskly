import {
  arePasswordsEqual,
  authRateLimiter,
  generateToken,
} from '@api/auth/auth.utils.js'
import { seedDemoData } from '@api/seed.js'
import { signInSchema, signUpSchema } from '@taskly/shared'
import bcrypt from 'bcrypt'
import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { validateData } from '../middleware/validation.middleware.js'

const router = Router()

router.post(
  '/signin',
  authRateLimiter,
  validateData(signInSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.body

      const saltRounds = parseInt(process.env.SALT || '10', 10)
      const hashedPassword = bcrypt.hashSync('password', saltRounds)

      if (
        email !== 'demo@company-demo.com' ||
        !(await arePasswordsEqual(password, hashedPassword))
      ) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Invalid email or password' })
        return
      }

      // Create a new demo company for each sign-in,
      // ensuring that each connected user has their own isolated environment for interaction.
      const user = await seedDemoData()
      const token = generateToken(user)

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: new Date(Date.now() + 86400000),
      })
      res.json({ success: true, user })
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/signup',
  authRateLimiter,
  validateData(signUpSchema),
  async (req, res, next) => {
    try {
      // same behaviour than sign in
      // we don't want to create new users for demo purposes
      const user = await seedDemoData()
      const token = generateToken(user)

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: new Date(Date.now() + 86400000),
      })

      res.json({ success: true })

      /* ## CREATE USER ##
       * For demo purpose creation is disabled
       */

      // const { email, password, username } = req.body
      //
      // const saltRounds = parseInt(process.env.SALT || '10', 10)
      // const hashedPassword = bcrypt.hashSync(password, saltRounds)
      // await createUser({
      //   email,
      //   username,
      //   password: hashedPassword,
      // })

      /* ## CREATE USER ## */
    } catch (error) {
      next(error)
    }
  }
)

router.post('/logout', (req, res) => {
  res.clearCookie('auth_token')
  res.json({ success: true })
})

export default router
