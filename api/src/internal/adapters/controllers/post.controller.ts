import { Request, Response, NextFunction } from 'express'
import catchAsync from '../../../shared/utils/catchAsync'
import AppError from '../../../shared/utils/appError'
import { STATUS_CODES } from '../../../shared/utils'
import { parseISO } from 'date-fns'
import { IPost, IRide, IRideType } from '../../domain/types'
import { Time } from '@googlemaps/google-maps-services-js'

export interface ICreateRideRequest {
  about: string
  start_location: string
  end_location: string
  actual_seats: number
  start_time: string
  duration: number
}
// Create a new ride
export const createPost = catchAsync(
  async (
    req: Request<any, any, ICreateRideRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      about,
      start_location: sLocation,
      end_location: eLocation,
      actual_seats: actualSeats,
      start_time: startTime,
      duration,
    } = req.body

    if (actualSeats < 1) {
      return next(
        new AppError(
          'total seats available must be at least 1',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    const startLocation = await req.repositories.location.getOrCreate({
      name: sLocation,
    })
    const endLocation = await req.repositories.location.getOrCreate({
      name: eLocation,
    })

    if (!startLocation || !endLocation) {
      return next(
        new AppError('error creating locations', STATUS_CODES.BAD_REQUEST),
      )
    }

    const newRide = await req.repositories.ride.create({
      userId: req.currUser.id,
      about: about,
      details: {
        startLocationID: startLocation.id,
        endLocationID: endLocation.id,
        actualSeats,
        startTime: parseISO(startTime),
        duration: duration,
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
