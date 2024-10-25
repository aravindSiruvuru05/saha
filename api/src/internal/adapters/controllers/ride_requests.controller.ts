import { Request, Response, NextFunction } from 'express'
import catchAsync from '../../../shared/utils/catchAsync'
import { STATUS_CODES } from '../../../shared/utils'
import AppError from '../../../shared/utils/appError'
import { UUID } from 'crypto'

export const joinRide = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { rideID } = req.body
    const ride = await req.repositories.ride.findRideByID(
      rideID,
      req.currUser.id,
    )
    if (!ride) {
      return next(
        new AppError(
          'No rides found for the requested ID',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }
    const rideRequest = await req.repositories.rideRequests.joinRide(
      rideID as UUID,
      req.currUser.id,
    )

    if (!rideRequest) {
      return next(
        new AppError('No rides found for the user', STATUS_CODES.BAD_REQUEST),
      )
    }

    // Return the fetched rides in the response
    res.status(STATUS_CODES.OK).json({
      data: {
        ...rideRequest,
      },
    })
  },
)
