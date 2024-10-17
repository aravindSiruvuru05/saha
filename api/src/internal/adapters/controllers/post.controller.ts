import { Request, Response, NextFunction } from 'express'
import catchAsync from '../../../shared/utils/catchAsync'
import AppError from '../../../shared/utils/appError'
import { STATUS_CODES } from '../../../shared/utils'
import { IPost, IRide, IRideType } from '../../domain/types'

// Create a new ride
export const createPost = catchAsync(
  async (
    req: Request<any, any, IPost<IRide>>,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      userId,
      details,
      content: {
        startLocationId,
        endLocationId,
        totalSeatsAvailable,
        totalSeatsFilled = 0,
        startTime,
        endTime,
      },
    } = req.body

    if (totalSeatsAvailable < 1) {
      return next(
        new AppError(
          'total seats available must be at least 1',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return next(
        new AppError(
          'start time must be before end time',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    // Create a new ride
    const newRide = await req.repositories.ride.create({
      userId,
      details,
      type: IRideType.RIDE,
      content: {
        startLocationId,
        endLocationId,
        totalSeatsAvailable,
        totalSeatsFilled,
        startTime,
        endTime,
      },
    })

    if (!newRide)
      return next(
        new AppError('some error occured while creating. please try', 500),
      )

    res.status(STATUS_CODES.CREATED).json({
      data: {
        ride: newRide,
      },
    })
  },
)
