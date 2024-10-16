import app from './app'

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

// Start the server
const port: number = parseInt(process.env.PORT || '8080', 10)
const server = app.listen(port, () => {
  console.log(`Listening on PORT ${port}`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
