import bcrypt from 'bcryptjs'
import { BaseModel } from './base.model'
import { IUser, IUserRole } from './types'

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
    this.photo = user.photo
    this.pic = user.pic
    this.role = user.role
    this.password = user.password
    this.passwordChangedAt = user.passwordChangedAt
  }

  public changePasswordAfter(jwtTimestamp: number) {
    if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(
        (this.passwordChangedAt.getTime() / 1000).toString(),
        10,
      )
      return jwtTimestamp < changedTimeStamp
    }
    return false
  }

  public async isCorrectPassword(
    candidatePassword: string,
    userPassword: string,
  ) {
    return await bcrypt.compare(candidatePassword, userPassword)
  }
}
