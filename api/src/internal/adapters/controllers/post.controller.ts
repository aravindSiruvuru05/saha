import { Request, Response, NextFunction } from 'express'
import catchAsync from '../../../shared/utils/catchAsync'
import AppError from '../../../shared/utils/appError'
import { STATUS_CODES } from '../../../shared/utils'
import { toZonedTime } from 'date-fns-tz'
import { ICreateRideRequest, IGetRidesReq } from './types'
import { getPlaceDetails } from '../../serviceHandlers/google.service'

// Create a new ride
export const createPost = catchAsync(
  async (
    req: Request<any, any, ICreateRideRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      about,
      fromLocation,
      toLocation,
      actualSeats,
      startTime,
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
      googlePlaceID: fromLocation.googlePlaceID,
      neighborhood: fromLocation.neighborhood,
      locality: fromLocation.locality,
      city: fromLocation.city,
    })
    const endLocation = await req.repositories.location.getOrCreate({
      googlePlaceID: toLocation.googlePlaceID,
      neighborhood: toLocation.neighborhood,
      locality: toLocation.locality,
      city: toLocation.city,
    })

    if (!startLocation || !endLocation) {
      return next(
        new AppError('error creating locations', STATUS_CODES.BAD_REQUEST),
      )
    }

    const newRide = await req.repositories.ride.create({
      user: { id: req.currUser.id },
      about: about,
      details: {
        fromLocationID: startLocation.googlePlaceID,
        toLocationID: endLocation.googlePlaceID,
        actualSeats,
        startTime: startTime.dateTimeValue,
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

export const getUserRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currUser.id

    const userRides = await req.repositories.ride.findRidesByUserID(userId)

    if (!userRides || userRides.length === 0) {
      return next(
        new AppError('No rides found for the user', STATUS_CODES.BAD_REQUEST),
      )
    }

    // Return the fetched rides in the response
    res.status(STATUS_CODES.OK).json({
      data: {
        rides: userRides,
      },
    })
  },
)

export const findRides = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { fromPlaceID, toPlaceID, startDate } =
      req.query as unknown as IGetRidesReq

    if (!fromPlaceID || !toPlaceID || !startDate) {
      return next(
        new AppError(
          'Start location and end location are required',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }
    const fromLocation = await getPlaceDetails(fromPlaceID)
    const toLocation = await getPlaceDetails(toPlaceID)
    // Parse start time if provided
    // let parsedStartTime
    // if (startDate) {
    //   parsedStartTime = parseISO(startDate)
    // }

    // Find rides between the locations
    const rides = await req.repositories.ride.findRides({
      fromLocation,
      toLocation,
      startDate,
    })
    if (!rides || rides.length === 0) {
      return res.status(STATUS_CODES.OK).json({
        data: {
          message: 'No rides found between these locations.',
          rides: [],
        },
      })
    }

    res.status(STATUS_CODES.OK).json({
      data: {
        fromLocation: fromLocation.description,
        toLocation: toLocation.description,
        rides,
      },
    })
  },
)
