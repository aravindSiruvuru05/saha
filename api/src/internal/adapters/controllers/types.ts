import { IUser } from '@shared/types/auth'
import { IPlaceDetails } from '@shared/types/google_place'

export interface IUserRequest extends IUser {
  confirmPassword: string
}

export interface IGetRidesReq {
  fromPlaceID: string
  toPlaceID: string
  startDate?: string
  endDate: string
}

interface IStartTime {
  dateTimeValue: string
  userTZ: string
}

export interface ICreateRideRequest {
  about: string
  fromLocation: IPlaceDetails
  toLocation: IPlaceDetails
  seats: number
  startTime: IStartTime
  duration: number
}
