import { UUID } from 'crypto'
import { ILocation } from '../adapters/controllers/types'

export enum IUserRole {
  ADMIN,
  MEMBER,
}

// Constraint for T to ensure it has an 'id' property
export interface IWithId {
  id: UUID
}

export interface IUser extends IWithId {
  name: string
  email: string
  photo: string
  pic: string
  role: IUserRole
  password: string
  passwordChangedAt?: Date
}

export enum IRideType {
  RIDE = 'RIDE',
  HOUSE_ACCOMDATION = 'HOUSE_ACCOMDATION',
}

export interface IPost<T = unknown> extends IWithId {
  user: Partial<IUser>
  details: T
  about: string
  type: IRideType
}

export interface IRide {
  fromLocation: ILocation
  toLocation: ILocation
  actualSeats: number
  seatsFilled: number
  startTime: string
  duration: number
}

export interface IUserRide extends IWithId {
  rideId: UUID
  userId: UUID
  status: BookingStatus
}

// Example for a house accommodation post
export interface IHouseAccommodation {
  location: string
  price: number
  availableFrom: Date
  numberOfMembers: number
}

export type HouseAccommodationPost = IPost<IHouseAccommodation>

export type BookingStatus = 'pending' | 'confirmed' | 'rejected'
