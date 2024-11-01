import { Request, Response, NextFunction } from 'express'
import catchAsync from '../../../shared/utils/catchAsync'
import AppError, { isAppError } from '../../../shared/utils/appError'
import { STATUS_CODES } from '../../../shared/utils'
import { getPlaceDetails } from '../../serviceHandlers/google.service'
import { UUID } from 'crypto'
import { IJoinRideReqQuery, ISearchRidesReqQuery } from '@shared/types/rides'
import {
  acceptRequestByHostService,
  cancelRequestService,
  createRideService,
  joinRideService,
} from '../../serviceHandlers/ride.service'

// Create a new ride
export const createRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { actualSeats } = req.body
    if (actualSeats < 1) {
      return next(
        new AppError(
          'total seats available must be at least 1',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    const newRide = await createRideService(
      req.repositories,
      req.body,
      req.currUser.id,
    )

    if (isAppError(newRide))
      return next(new AppError(newRide.message, newRide.statusCode))

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

    res.status(STATUS_CODES.OK).json({
      data: {
        rides: userRides,
      },
    })
  },
)

export const getRideByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const ride = await req.repositories.ride.findRideByID(
      id as UUID,
      req.currUser.id,
    )

    if (!ride) {
      return next(
        new AppError('No rides found for the user', STATUS_CODES.BAD_REQUEST),
      )
    }

    // Return the fetched rides in the response
    res.status(STATUS_CODES.OK).json({
      data: {
        ...ride,
      },
    })
  },
)

export const searchRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fromPlaceID, toPlaceID, startDate, endDate } =
      req.query as unknown as ISearchRidesReqQuery

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

    const rides = await req.repositories.ride.searchRides(
      {
        fromLocation,
        toLocation,
        startDate,
        endDate,
      },
      req.currUser.id,
    )
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

export const joinRideByPassenger = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { rideID } = req.query as unknown as IJoinRideReqQuery
    const passengerID = req.currUser.id
    const rideRequest = await joinRideService(
      req.repositories,
      rideID as UUID,
      passengerID as UUID,
    )
    if (isAppError(rideRequest))
      return next(new AppError(rideRequest.message, rideRequest.statusCode))

    res.status(STATUS_CODES.OK).json({
      data: {
        ...rideRequest,
      },
    })
  },
)

export const cancelRequestByPassenger = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { rideID } = req.body
    const passengerID = req.currUser.id
    const rideRequest = await cancelRequestService(
      req.repositories,
      rideID as UUID,
      passengerID as UUID,
    )
    if (isAppError(rideRequest))
      return next(new AppError(rideRequest.message, rideRequest.statusCode))

    res.status(STATUS_CODES.OK).json({
      data: {
        ...rideRequest,
      },
    })
  },
)

export const acceptRequestByHost = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { hostID } = req.body
    const { requestID } = req.query
    if (!hostID) {
      return next(
        new AppError(
          'Please provide ride request ID to accept.',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    const isAcceptSuccess = await acceptRequestByHostService(
      req.repositories,
      requestID as UUID,
      hostID,
    )
    res.status(STATUS_CODES.OK).json({
      data: {
        isAcceptSuccess,
      },
    })
  },
)

export const declineRequest = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { requestID } = req.body
    const isDeclineSuccess = await acceptRequestByHostService(
      req.repositories,
      requestID as UUID,
      req.currUser.id,
    )
    res.status(STATUS_CODES.OK).json({
      data: {
        isDeclineSuccess,
      },
    })
  },
)

export const getPendingRequestsForMyRides = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const rideRequests =
      await req.repositories.rideRequests.getPendingRequestsForMyRides(
        req.currUser.id,
      )

    res.status(STATUS_CODES.OK).json({
      data: rideRequests,
    })
  },
)
