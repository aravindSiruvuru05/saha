import { IPlaceDetails } from '@/utils/google_places';
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
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo?: string;
}

export enum IUserRole {
  ADMIN,
  MEMBER,
}

export interface IUserResult extends IWithID {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pic?: string;
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

export interface ISearchRidesRes {
  fromLocation: string;
  toLocation: string;
  rides: IPost<IRide>[];
}
export interface IPost<T = unknown> extends IWithID {
  host: IUserResult;
  details: T;
  about: string;
  type: IRideType;
  currUserReqStatus: RideRequestStatus;
}

export interface IRide {
  fromLocation: IPlaceDetails;
  toLocation: IPlaceDetails;
  actualSeats: number;
  seatsFilled: number;
  startTime: string;
  endTime?: string;
}

interface IStartTime {
  dateTimeValue: string;
  userTZ: string;
}

export interface ICreateRideRequest {
  about: string;
  fromLocation: IPlaceDetails;
  toLocation: IPlaceDetails;
  actualSeats: number;
  startTime: IStartTime;
}

export interface ISearchRidesReqQuery {
  fromPlaceID: string;
  toPlaceID: string;
  startDate: string;
  endDate: string;
}

export interface IGetRideReqQuery {
  id: string;
}

export interface IJoinRideRequest {
  rideID: string;
}

export interface ICancelRideRequest {
  rideID: string;
}

export interface IAcceptRideRequest {
  requestID: string;
}

export enum RideRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export interface IRideRequestResponse {
  id: UUID;
  ridePost: Partial<IPost<IRide>>;
  status: RideRequestStatus;
  requester: Partial<IUserResult>;
}
