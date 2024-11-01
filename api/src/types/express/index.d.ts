// express.d.ts
import { LocationRepository } from '../../internal/adapters/repositories/location.repository'
import { RideRepository } from '../../internal/adapters/repositories/ride.repository'
import { RideRequestsRepository } from '../../internal/adapters/repositories/ride_requests.repository'
import { UserRepository } from '../../internal/adapters/repositories/user.repository'
import { Ride } from '../../internal/domain/ride'
import { User } from '../../internal/domain/user'
import express from 'express'

declare global {
  namespace Express {
    interface Request {
      currUser: IUser
      repositories: {
        user: UserRepository
        ride: RideRepository
        rideRequests: RideRequestsRepository
        location: LocationRepository
      }
    }
  }
}
