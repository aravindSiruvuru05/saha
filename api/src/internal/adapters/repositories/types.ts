import { IWithId } from '../../domain/types'

export enum IUserRoleEntity {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface IUserEntity extends IWithId {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  photo?: string
  pic?: string
  role: IUserRoleEntity
  password: string
  passwordChangedAt?: string
}
