// logger.ts
import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf, colorize } = format

// Define the custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

// Create the logger
const logger = createLogger({
  level: 'info', // Log level
  format: combine(
    colorize(), // Colorize logs for console output
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
    logFormat, // Use the custom log format
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'logs/combined.log' }), // Log to a file
  ],
})

export default logger
