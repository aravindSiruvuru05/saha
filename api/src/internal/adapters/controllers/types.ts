import { IUser } from '../../domain/types'

export interface IUserRequest extends IUser {
  confirm_password: string
}

export interface IGetRidesReq {
  fromPlaceID: string
  toPlaceID: string
  startDate?: string
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
