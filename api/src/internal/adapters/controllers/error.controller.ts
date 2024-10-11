import { Request, Response, NextFunction } from 'express'
import AppError from '../../../shared/utils/appError'

// Handle database cast error
const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

// Handle JSON web token error
const handleJsonWebTokenError = (): AppError =>
  new AppError('Invalid token. Please login again', 401)

// Handle token expiration error
const handleTokenExpiredError = (): AppError =>
  new AppError('Your token has expired. Please login again.', 401)

// Handle duplicate fields error
const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.constraint // constraint: 'users_email_key'
  const result = value.replace(/^[^_]+_|_[^_]+$/g, '') // result = email
  const message = `${result} already exists.`
  return new AppError(message, 409)
}

// Handle validation errors
const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

// Send error response in development
const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

// Send error response in production
const sendErrorProd = (err: AppError, res: Response): void => {
  console.log(err.message)
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    })
  } else {
    // Log error
    console.error('ERROR 💥', err)

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    })
  }
}

// Main error handling middleware
export default (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    // AppError message is not getting destructured as it is in the Parent Error and destructring is happening on the top level of the AppError
    let error = { ...err, message: err.message }

    error.isOperational = true // making all below as operationsal so that they are returned in sendProdError instead of default value
    if (error.name === 'CastError') error = handleCastErrorDB(error)
    else if (error.code === '23505') error = handleDuplicateFieldsDB(error)
    else if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error)
    else if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError()
    else if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError()
    else error.isOperational = false
    sendErrorProd(error, res)
  }
}
