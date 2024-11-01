import { Request, Response, NextFunction } from 'express'
import { validate as isUUID } from 'uuid'
import catchAsync from '../../../shared/utils/catchAsync'
import { findByID } from '../../serviceHandlers/auth.service'
import AppError from '../../../shared/utils/appError'
import { IUser } from '@shared/types/auth'

export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let user: IUser | null
    const userId = req.params.id

    if (!isUUID(userId))
      return next(new AppError('Pleasee provide valid user ID', 400))

    user = await findByID(req, req.params.id)
    if (!user) return next(new AppError('User not found', 400))

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        user,
      },
    })
  },
)
