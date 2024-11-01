import { RideRequestStatus } from '@shared/types/ride_requests'
import { UUID } from 'crypto'

export interface ICreateRideAndRideRequestEntity {
  about: string
  fromLocationID: UUID
  toLocationID: UUID
  seats: number
  startTime: string
  passengerID: UUID
}

export interface IRideRequestEntity {
  id: UUID
  requesterID: UUID
  rideID: UUID
  status: RideRequestStatus
}
