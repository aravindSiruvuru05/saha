import { Request, Response, NextFunction } from 'express'
import catchAsync from '../../../shared/utils/catchAsync'
import { STATUS_CODES } from '../../../shared/utils'
import AppError from '../../../shared/utils/appError'
import { RideRequestStatus } from '../repositories/types'

export const joinRide = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { rideID } = req.body
    const requesterID = req.currUser.id

    const ride = await req.repositories.ride.findRideByID(rideID, requesterID)
    if (!ride) {
      return next(
        new AppError(
          'No rides found for the requested ID',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    if (requesterID === ride.host.id) {
      return next(
        new AppError('host cant join the ride', STATUS_CODES.BAD_REQUEST),
      )
    }
    let rideRequest = null
    rideRequest = await req.repositories.rideRequests.findByUserRideID(
      ride.id,
      requesterID,
    )

    if (rideRequest) {
      if (rideRequest.status != RideRequestStatus.CANCELED) {
        return next(
          new AppError(
            `your request is already Accepted/Declined/Pending state`,
            STATUS_CODES.BAD_REQUEST,
          ),
        )
      }
      rideRequest = await req.repositories.rideRequests.joinRide(rideRequest.id)
    } else {
      rideRequest = await req.repositories.rideRequests.createRequest(
        rideID,
        requesterID,
      )
    }

    res.status(STATUS_CODES.OK).json({
      data: {
        ...rideRequest,
      },
    })
  },
)

export const cancelRequest = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { rideID } = req.body
    const requesterID = req.currUser.id

    const rideReq = await req.repositories.rideRequests.findByUserRideID(
      rideID,
      requesterID,
    )

    let isRequestCanceled = false

    if (rideReq.status === RideRequestStatus.PENDING) {
      // If the request is pending, cancel it directly
      isRequestCanceled = await req.repositories.rideRequests.cancelRequest(
        rideReq.id,
      )
    } else if (rideReq.status === RideRequestStatus.ACCEPTED) {
      // If the request is accepted, cancel it and reduce seats_filled in the rides table
      await req.repositories.ride.reduceSeatFilled(rideID)
      isRequestCanceled = await req.repositories.rideRequests.cancelRequest(
        rideReq.id,
      )
    } else {
      return next(
        new AppError(
          'Cannot cancel a declined/canceled ride request',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    res.status(STATUS_CODES.OK).json({
      data: {
        isRequestCanceled,
      },
    })
  },
)

export const acceptRequest = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { requestID } = req.body
    if (!requestID) {
      return next(
        new AppError(
          'Please provide ride request ID to accept.',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }
    const rideRequest =
      await req.repositories.rideRequests.findRideRequestByRequestID(requestID)
    if (rideRequest && rideRequest.ridePost.host?.id !== req.currUser.id) {
      return next(
        new AppError(
          'Current users is not host of given ride to accept',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    const accepted =
      await req.repositories.rideRequests.acceptRequest(requestID)

    res.status(STATUS_CODES.OK).json({
      data: {
        accepted,
      },
    })
  },
)

export const declineRequest = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { requestID } = req.body
    const rideRequest =
      await req.repositories.rideRequests.findRideRequestByRequestID(requestID)

    if (rideRequest && rideRequest.ridePost.host?.id !== req.currUser.id) {
      return next(
        new AppError(
          'Current users is not host of given ride to accept',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    if (
      rideRequest &&
      (rideRequest.status == RideRequestStatus.ACCEPTED ||
        rideRequest.status == RideRequestStatus.DECLINED)
    ) {
      return next(
        new AppError(
          'Ride already Accepted/Declined',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }

    const declined =
      await req.repositories.rideRequests.declineRequest(requestID)

    res.status(STATUS_CODES.OK).json({
      data: {
        declined,
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
