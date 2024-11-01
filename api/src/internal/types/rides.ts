import { RideType } from '@shared/types/rides'
import { UUID } from 'crypto'

export interface IRideEntity {
  id: string
  host_id: UUID
  about: string
  from_location_id: string
  to_location_id: string
  actual_seats: number
  seats_filled?: number
  start_time: string
  type: RideType
  distance: string
  price?: string
  car_model?: string
}
