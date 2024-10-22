import { IUser } from '../../domain/types'

export interface IUserRequest extends IUser {
  confirmPassword: string
}

export interface IGetRidesReq {
  fromPlaceID: string
  toPlaceID: string
  startDate?: string
  endDate: string
}

export interface ILocation {
  googlePlaceID: string
  neighborhood: string
  locality: string
  city: string
}

interface IStartTime {
  dateTimeValue: string
  userTZ: string
}

export interface ICreateRideRequest {
  about: string
  fromLocation: ILocation
  toLocation: ILocation
  actualSeats: number
  startTime: IStartTime
  duration: number
}
