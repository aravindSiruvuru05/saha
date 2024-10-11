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

// POSTS

export interface ILocation extends IWithId {
  name: string
}

export interface IPost extends IWithId {
  details?: string
  userId: UUID
}

export interface ICarPooling extends IWithId {
  post_id: UUID
  startLocationID: UUID
  endLocationID: UUID
  startTime: Date
  endTime?: Date
}
