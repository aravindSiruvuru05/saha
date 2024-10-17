import { UUID } from 'crypto'

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
  role: IUserRole
  password: string
  passwordChangedAt?: Date
}

export enum IRideType {
  RIDE = 'RIDE',
  HOUSE_ACCOMDATION = 'HOUSE_ACCOMDATION',
}

export interface ILocation extends IWithId {
  name: string
}
export interface IPost<T = unknown> extends IWithId {
  userId: string
  details?: string
  content: T
  type: IRideType
}

export interface IRide {
  details?: string
  startLocationId: string
  endLocationId: string
  totalSeatsAvailable: number
  totalSeatsFilled: number
  startTime: Date
  endTime?: Date
}

export interface IUserRide extends IWithId {
  rideId: string
  userId: string
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
