import { IWithID } from '@shared/types'
import { IUserRole } from '@shared/types/auth'

export interface IUserEntity extends IWithID {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  photo?: string
  pic?: string
  role: IUserRole
  password: string
  passwordChangedAt?: Date
}
