import { IPost } from '@shared/types/post'
import { ICreateRideReqBody, IRide, RideType } from '@shared/types/rides'
import { Request } from 'express'
import { IAppError } from '../../shared/utils/appError'
import { STATUS_CODES } from '../../shared/utils'
import { getPlaceDetails, getdistanceData } from './google.service'
import { UUID } from 'crypto'
import { IRideRequest, RideRequestStatus } from '@shared/types/ride_requests'

export const createRideService = async (
  repos: Request['repositories'],
  ride: ICreateRideReqBody,
  currUserID: UUID,
): Promise<IPost<IRide> | IAppError> => {
  const { about, actualSeats, startTime, fromLocation, toLocation } = ride
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
      message: 'Error creating locations',
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    }
  }

  const distance = await getdistanceData({
    origins: startLocation.googlePlaceID,
    destinations: endLocation.googlePlaceID,
  })

  const newRide = await repos.ride.create({
    host_id: currUserID,
    about: about,
    from_location_id: startLocation.googlePlaceID,
    to_location_id: endLocation.googlePlaceID,
    actual_seats: actualSeats,
    start_time: startTime,
    distance: distance.toString(),
    type: RideType.HOST,
  })

  return newRide
}

export const joinRideService = async (
  repos: Request['repositories'],
  rideID: UUID,
  passengerID: UUID,
): Promise<IRideRequest | IAppError> => {
  const ride = await repos.ride.findRideByID(rideID, passengerID)
  if (!ride) {
    return {
      message: 'No rides found for the requested ID',
      statusCode: STATUS_CODES.BAD_REQUEST,
    }
  }

  if (passengerID === ride.host.id) {
    return {
      message: 'Host cant join the ride',
      statusCode: STATUS_CODES.BAD_REQUEST,
    }
  }
  let rideRequest = null
  rideRequest = await repos.rideRequests.findByUserRideID(ride.id, passengerID)

  if (rideRequest) {
    if (rideRequest.status != RideRequestStatus.CANCELED) {
      return {
        message: 'your request is already Accepted/Declined/Pending state',
        statusCode: STATUS_CODES.BAD_REQUEST,
      }
    }
    rideRequest = await repos.rideRequests.joinRide(rideRequest.id)
  } else {
    rideRequest = await repos.rideRequests.createRideRequest(
      rideID,
      passengerID,
    )
  }
  return rideRequest
}

export const cancelRequestService = async (
  repos: Request['repositories'],
  rideID: UUID,
  currUserID: UUID,
): Promise<IRideRequest | IAppError> => {
  const rideReq = await repos.rideRequests.findByUserRideID(rideID, currUserID)

  let rideRequest: IRideRequest | null
  //TODO: see what value is retured in below repo calls and use appropriate returns
  if (rideReq.status === RideRequestStatus.PENDING) {
    // If the request is pending, cancel it directly
    rideRequest = await repos.rideRequests.cancelRequest(rideReq.id)
  } else if (rideReq.status === RideRequestStatus.ACCEPTED) {
    // If the request is accepted, cancel it and reduce seats_filled in the rides table
    await repos.ride.reduceSeatFilled(rideID)
    rideRequest = await repos.rideRequests.cancelRequest(rideReq.id)
  } else {
    return {
      message: 'Cannot cancel a declined/canceled ride request',
      statusCode: STATUS_CODES.BAD_REQUEST,
    }
  }
  if (!rideRequest)
    return {
      message: 'Invalid request ID',
      statusCode: STATUS_CODES.BAD_REQUEST,
    }

  return rideRequest
}

export const acceptRequestByHostService = async (
  repos: Request['repositories'],
  requestID: UUID,
  currUserID: UUID,
): Promise<boolean | IAppError> => {
  const rideRequest =
    await repos.rideRequests.findRideRequestByRequestID(requestID)
  if (rideRequest && rideRequest.post.host?.id !== currUserID) {
    return {
      message: 'Current users is not host of given ride to accept',
      statusCode: STATUS_CODES.BAD_REQUEST,
    }
  }

  const acceptedRideRequest = await repos.rideRequests.acceptRequest(requestID)

  if (!acceptedRideRequest) {
    return {
      message: 'Error accepting the request',
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    }
  }

  return !!acceptedRideRequest
}

export const declineRequestByHostService = async (
  repos: Request['repositories'],
  requestID: UUID,
  hostID: UUID,
): Promise<boolean | IAppError> => {
  const rideRequest =
    await repos.rideRequests.findRideRequestByRequestID(requestID)

  if (rideRequest && rideRequest.post.host?.id !== hostID) {
    return {
      message: 'Current users is not host of given ride to accept',
      statusCode: STATUS_CODES.BAD_REQUEST,
    }
  }

  if (
    rideRequest &&
    (rideRequest.status == RideRequestStatus.ACCEPTED ||
      rideRequest.status == RideRequestStatus.DECLINED)
  ) {
    return {
      message: 'Ride already Accepted/Declined',
      statusCode: STATUS_CODES.BAD_REQUEST,
    }
  }

  const declined = await repos.rideRequests.declineRequest(requestID)

  if (declined == null) {
    return {
      message: 'Error declining the request. please try again',
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    }
  }

  return declined
}
