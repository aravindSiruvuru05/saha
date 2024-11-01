import { IWithID } from ".";
import { IUser } from "./auth";

export interface IPost<T = unknown> extends IWithID {
  host: IUser;
  details: T;
  about: string;
  type: PostType;
  currUserReqStatus: PostRequestStatus;
}
export enum PostType {
  RIDE = "RIDE",
  HOUSE_ACCOMDATION = "HOUSE_ACCOMDATION",
}

export enum PostRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}
