import { BaseModel } from './base.model'
import { IUser, IUserRole } from '@shared/types/auth'

export class User extends BaseModel<IUser> {
  private static instance: User

  public firstName!: string
  public lastName!: string
  public phoneNumber!: string
  public email!: string
  public pic!: string
  public photo!: string | null
  public role!: IUserRole
  public password?: string
  public passwordChangedAt?: Date

  constructor(user?: IUser) {
    super(user ? user.id : null)
    if (!user) return
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.phoneNumber = user.phoneNumber
    this.email = user.email
    this.pic = user.pic || ''
    this.role = user.role
  }
}
