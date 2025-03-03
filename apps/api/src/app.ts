import { errorHandler } from '@api/middleware/errorHandler.middleware.js'
import logger from '@api/middleware/logger.middleware.js'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import authRoutes from './auth/auth.routes.js'
import taskRoutes from './task/task.routes.js'
import userRoutes from './user/user.routes.js'

const app = express()

app.use(
  cors({
    origin: process.env.SITE_URL,
    credentials: true,
  })
)
app.use(cookieParser())
app.use(logger)
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send({ message: 'Hello World' })
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/task', taskRoutes)

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' })
})

app.use(errorHandler)

export default app
