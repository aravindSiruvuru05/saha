class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    console.log(message, 'mmesa')
    super(message)

    this.statusCode = statusCode
    this.isOperational = true

    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
