// controllers/googleMapsController.ts
import { Request, Response, NextFunction } from 'express'
import catchAsync from '../../../shared/utils/catchAsync'
import { STATUS_CODES } from '../../../shared/utils'
import googleMapsService from '../../../shared/utils/googleMaps'
import { TravelMode } from '@googlemaps/google-maps-services-js'
import { ParsedUrlQuery } from 'querystring'

// interface IGoogleMapsDistanceMatrixRequestParams {
//   originPlaceId: string
//   destinationPlaceId: string
//   mode?: TravelMode
// }

// Google Maps Distance Matrix controller
export const distanceMatrix = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { origins, destinations } = req.query as {
      origins: string
      destinations: string
    }
    const distanceData = await googleMapsService
      .getInstance()
      .getDistanceMatrix({
        origins,
        destinations,
      })

    res.status(STATUS_CODES.OK).json({
      data: distanceData,
    })
  },
)

export const placeDetails = catchAsync(
  async (req: Request<any, any, any>, res: Response, next: NextFunction) => {
    const { id: placeID } = req.query as { id: string }
    const placeDetails = await googleMapsService
      .getInstance()
      .getPlaceDetails(placeID)

    res.status(STATUS_CODES.OK).json({
      data: placeDetails,
    })
  },
)
