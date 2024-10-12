import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import catchAsync from '../../../shared/utils/catchAsync'
import { STATUS_CODES, signToken } from '../../../shared/utils'
import AppError from '../../../shared/utils/appError'
import {
  createUser,
  findByID,
  getUserByEmail,
} from '../../serviceHandlers/auth.service'
import { IUserRequest } from './types'
import { IUserRole } from '../../domain/types'

// User signup
export const signup = catchAsync(
  async (
    req: Request<any, any, IUserRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      name,
      email,
      password,
      photo,
      confirm_password: confirmPassword,
    } = req.body

    if (password !== confirmPassword) {
      return next(
        new AppError(
          'Given password and confirm password did not match.',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    const newUser = await createUser(req, {
      name,
      email,
      password,
      photo,
      role: IUserRole.MEMBER,
    })
    if (!newUser) return next(new AppError('user not created', 500))

    const token = signToken(newUser.id)

    res.status(STATUS_CODES.CREATED).json({
      data: {
        token,
      },
    })
  },
)

// User signin
export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
      return next(
        new AppError(
          'Please provide email and password',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    const user = await getUserByEmail(req, email)

    if (!user || !(await user.isCorrectPassword(password, user.password!))) {
      return next(new AppError('Incorrect email or password', 401))
    }

    const token = signToken(user.id)
    delete user.password
    delete user.passwordChangedAt

    res.status(STATUS_CODES.OK).json({
      data: {
        token,
        user,
      },
    })
  },
)

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please login to get access', 401),
      )
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload

    const currentUser = await findByID(req, decoded['id'])

    // Check if user exists with that token
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token does not exist!', 401),
      )
    }

    // Check if user changed password after the token was issued
    if (decoded.iat && currentUser.changePasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'The password was changed recently. Kindly login again.',
          401,
        ),
      )
    }

    req.currUser = currentUser

    // Grant permission for protected routes
    next()
  },
)

// Restrict access to certain roles
export const restrictTo = (...roles: IUserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currUser.role)) {
      return next(
        new AppError('You don’t have permission to perform this action', 403),
      )
    }
    next()
  }
}
