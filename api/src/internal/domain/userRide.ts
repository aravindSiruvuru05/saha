import { BaseModel } from './base.model'
import { IUserRide, BookingStatus } from './types'

export class UserRide extends BaseModel<IUserRide> {
  private static instance: UserRide

  public rideId!: string
  public userId!: string
  public status!: BookingStatus

  constructor(userRide?: IUserRide) {
    super(userRide ? userRide.id : null)
    if (!userRide) return
    this.rideId = userRide.rideId
    this.userId = userRide.userId
    this.status = userRide.status
  }
}
