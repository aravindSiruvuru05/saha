import { UUID } from 'crypto';

export interface IDistanceResponse {
  distance: string;
  duration: string;
}

export interface IWithID {
  id: UUID;
}
export interface ISigninPayload {
  email: string;
  password: string;
}

export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  photo?: string;
}

export enum IUserRole {
  ADMIN,
  MEMBER,
}

export interface IUserResult extends IWithID {
  name: string;
  email: string;
  role: IUserRole;
}
export interface ISigninResult {
  token: string;
  user: IUserResult;
}

export interface IApiResponse<T> {
  data: T;
}
export interface ISignupResult {
  token: string;
}

export interface IDistanceResponse {
  distance: string;
  duration: string;
}

export enum IRideType {
  RIDE = 'RIDE',
  HOUSE_ACCOMDATION = 'HOUSE_ACCOMDATION',
}

export interface ILocation extends IWithID {
  name: string;
}
export interface IPost<T = unknown> extends IWithID {
  userId: string;
  details: T;
  about: string;
  type: IRideType;
}
export interface IPost<T = unknown> extends IWithID {
  userId: string;
  details: T;
  about: string;
  type: IRideType;
}

export interface IRide {
  startLocationId: string;
  endLocationId: string;
  actualSeats: number;
  seatsFilled: number;
  startTime: Date;
  endTime?: Date;
}

export interface ICreateRideRequest {
  about: string;
  start_location: string;
  end_location: string;
  actual_seats: number;
  start_time: string;
}
