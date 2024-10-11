import { IUser } from '../../domain/types'

export interface IUserRequest extends IUser {
  confirm_password: string
}
