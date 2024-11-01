class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
    this.isOperational = true

    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor)
  }
}

export interface IAppError {
  message: string
  statusCode: number
}

export const isAppError = (error: any): error is IAppError => {
  if (error && !!error.message && !!error.statusCode) {
    return true
  }
  return false
}
export default AppError
