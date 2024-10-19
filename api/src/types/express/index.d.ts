// express.d.ts
import { LocationRepository } from '../../internal/adapters/repositories/location.repository'
import { RideRepository } from '../../internal/adapters/repositories/ride.repository'
import { UserRepository } from '../../internal/adapters/repositories/user.repository'
import { Ride } from '../../internal/domain/ride'
import { User } from '../../internal/domain/user'
import express from 'express'

declare global {
  namespace Express {
    interface Request {
      currUser: User
      models: {
        user: User
        ride: Ride
      }
      repositories: {
        user: UserRepository
        ride: RideRepository
        location: LocationRepository
      }
    }
  }
}
