import { UUID } from "crypto";
import { IUser } from "./auth";
import { IRide } from "./rides";
import { IPost } from "./post";
import { IPlaceDetails } from "./google_place";

export interface IRideRequest {
  id: UUID;
  post: IPost<IRide>;
  requestedSeats: number;
  status: RideRequestStatus;
  passenger: Omit<IUser, "password">;
}

export enum RideRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  CANCELED = "canceled",
}

export interface ICreateRideRequestReqBody {
  about: string;
  fromLocation: IPlaceDetails;
  toLocation: IPlaceDetails;
  startTime: string;
  seats: number;
}
