import { BaseModel } from './base.model'
import { IPost, IRide } from './types'

export class Ride extends BaseModel<IPost<IRide>> {
  private static instance: Ride

  public userId!: string
  public details?: string
  public content!: IRide

  constructor(ride?: IPost<IRide>) {
    super(ride ? ride.id : null)
    if (!ride) return
    this.userId = ride.userId
    this.details = ride.details
    const content = ride.content
    this.content = {
      startLocationId: content.startLocationId,
      endLocationId: content.endLocationId,
      totalSeatsAvailable: content.totalSeatsAvailable,
      totalSeatsFilled: content.totalSeatsFilled,
      startTime: content.startTime,
      endTime: content.endTime,
    }
  }
}
