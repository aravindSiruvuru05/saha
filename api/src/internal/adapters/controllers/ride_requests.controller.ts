import { Request, Response, NextFunction } from 'express'
import catchAsync from '../../../shared/utils/catchAsync'
import { STATUS_CODES } from '../../../shared/utils'
import AppError, { isAppError } from '../../../shared/utils/appError'
import { ICreateRideRequest } from './types'
import { UUID } from 'crypto'
import { getPlaceDetails } from '../../serviceHandlers/google.service'
import { createRideAndRideRequestService } from '../../serviceHandlers/ride_request'

export const createRideAndRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { seats } = req.body
    if (seats < 1) {
      return next(
        new AppError(
          'Please provide minimum 1 seat to create request.',
          STATUS_CODES.BAD_REQUEST,
        ),
      )
    }
    const newRide = await createRideAndRideRequestService(
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

// export const searchRideRequests = catchAsync(
//   async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
//     const { fromPlaceID, toPlaceID, startDate, endDate } = req.query

//     if (!fromPlaceID || !toPlaceID || !startDate) {
//       return next(
//         new AppError(
//           'Start location and end location are required',
//           STATUS_CODES.BAD_REQUEST,
//         ),
//       )
//     }
//     const fromLocation = await getPlaceDetails(fromPlaceID as string)
//     const toLocation = await getPlaceDetails(toPlaceID as string)

//     // Find rides between the locations
//     const rides = await req.repositories.ride.searchRides(
//       {
//         fromLocation,
//         toLocation,
//         startDate,
//         endDate,
//       },
//       req.currUser.id,
//     )
//     if (!rides || rides.length === 0) {
//       return res.status(STATUS_CODES.OK).json({
//         data: {
//           message: 'No rides found between these locations.',
//           rides: [],
//         },
//       })
//     }

//     res.status(STATUS_CODES.OK).json({
//       data: {
//         fromLocation: fromLocation.description,
//         toLocation: toLocation.description,
//         rides,
//       },
//     })
//   },
// )
