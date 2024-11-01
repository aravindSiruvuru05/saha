import { IWithID } from ".";

export interface IUser extends IWithID {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pic?: string;
  email: string;
  role: IUserRole;
}
export interface ISigninRes {
  token: string;
  user: IUser;
}
export interface ISignupRes {
  token: string;
}

export interface ISigninPayload {
  email: string;
  password: string;
}

export interface ISignupPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pic?: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo?: string;
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
  ADMIN = "admin",
  MEMBER = "member",
}
