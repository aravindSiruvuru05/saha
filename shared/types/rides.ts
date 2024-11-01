import { UUID } from "crypto";
import { IPost, PostRequestStatus } from "./post";
import { IUser } from "./auth";
import { IDistanceRes, IPlaceDetails } from "./google_place";

export enum RideType {
  HOST = "host",
  PASSENGER = "passenger",
}

export interface IRide {
  fromLocation: IPlaceDetails;
  toLocation: IPlaceDetails;
  actualSeats: number;
  seatsFilled: number;
  startTime: string;
  distance: IDistanceRes;
  type: RideType;
  passengers: IUser[];
}

export interface ICreateRideReqBody {
  about: string;
  fromLocation: IPlaceDetails;
  toLocation: IPlaceDetails;
  actualSeats: number;
  startTime: string;
}

export interface ISearchRidesRes {
  fromLocation: string;
  toLocation: string;
  rides: IPost<IRide>[];
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

export interface IJoinRideReqQuery {
  rideID: string;
}

export interface ICancelRideReqQuery {
  requestID: string;
}

export interface IAcceptRideReqQuery {
  requestID: string;
}

export interface IDeclineRideReqQuery {
  requestID: string;
}

export interface IRideRequestResponse {
  id: UUID;
  ridePost: Partial<IPost<IRide>>;
  status: PostRequestStatus;
  requester: Partial<IUser>;
}

export interface RideSearchState {
  fromLocation?: IPlaceDetails;
  toLocation?: IPlaceDetails;
  rideDate?: Date;
}
