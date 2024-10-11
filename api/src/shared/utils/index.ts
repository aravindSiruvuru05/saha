import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  // Add other status codes as needed
} as const

const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 12)
  return hashed
}

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

export { STATUS_CODES, hashPassword, signToken }
