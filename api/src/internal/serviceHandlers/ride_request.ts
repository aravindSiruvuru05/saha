import { Request } from 'express'
import { IAppError } from '../../shared/utils/appError'
import { UUID } from 'crypto'
import {
  ICreateRideRequestReqBody,
  IRideRequest,
} from '@shared/types/ride_requests'
import { STATUS_CODES } from '../../shared/utils'

export const createRideAndRideRequestService = async (
  repos: Request['repositories'],
  rideRequest: ICreateRideRequestReqBody,
  currUserID: UUID,
): Promise<IRideRequest | IAppError> => {
  const { about, fromLocation, toLocation, seats, startTime } = rideRequest
  const startLocation = await repos.location.getOrCreate({
    googlePlaceID: fromLocation.googlePlaceID,
    neighborhood: fromLocation.neighborhood,
    locality: fromLocation.locality,
    city: fromLocation.city,
  })
  const endLocation = await repos.location.getOrCreate({
    googlePlaceID: toLocation.googlePlaceID,
    neighborhood: toLocation.neighborhood,
    locality: toLocation.locality,
    city: toLocation.city,
  })

  if (!startLocation || !endLocation) {
    return {
      message: 'error creating locations',
      statusCode: STATUS_CODES.BAD_REQUEST,
    }
  }

  const newRideRequest = await repos.rideRequests.createRideAndRideRequest({
    about,
    fromLocationID: startLocation.googlePlaceID as UUID,
    toLocationID: endLocation.googlePlaceID as UUID,
    seats,
    startTime: startTime,
    passengerID: currUserID,
  })

  if (!newRideRequest)
    return {
      message: 'some error occured while creating. please try again.',
      statusCode: 500,
    }
  return newRideRequest
}
