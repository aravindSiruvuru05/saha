import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import cors from 'cors' // Import the cors package

import AppError from './shared/utils/appError'
import { router as userRouter } from './infra/routers/user.router'
import authRouter from './infra/routers/auth.router'
import googleRouter from './infra/routers/googleMaps.router'
import globalErrorHandler from './internal/adapters/controllers/error.controller'
import pool from './infra/db'
import { User } from './internal/domain/user'
import { UserRepository } from './internal/adapters/repositories/user.repository'
import { protect } from './internal/adapters/controllers/auth.controller'

const app = express()

// Middleware for logging requests
app.use(morgan('dev'))
app.use(express.json())

const corsOptions = {
  origin: '*', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specified HTTP methods
  credentials: true, // Allow credentials to be sent with requests
}

app.use(cors(corsOptions)) // Use the CORS middleware

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`REQUEST BODY::::> ${JSON.stringify(req.body)}`)
  console.log(`REQUEST QUERY PARAMS:::::> ${JSON.stringify(req.query)}`)
  next()
})
const userRepository = new UserRepository(pool)

export const injectModels = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.models = {
    user: new User(),
  }
  req.repositories = {
    user: userRepository,
  }
  next()
}
app.use(injectModels)
// Route handlers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', protect, userRouter)
app.use('/api/v1/google', protect, googleRouter)

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url)
  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404))
})

// Global error handler
app.use(globalErrorHandler)

export default app
