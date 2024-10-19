import { IWithId } from '../../domain/types'

export enum IUserRoleEntity {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface IUserEntity extends IWithId {
  name: string
  email: string
  photo?: string
  role: IUserRoleEntity
  password: string
  passwordChangedAt?: string
}
