import { BaseModel } from './base.model'
import { IPost, IRide } from './types'

export class Ride extends BaseModel<IPost<IRide>> {
  private static instance: Ride

  public about?: string
  public content!: IRide

  constructor(ride?: IPost<IRide>) {
    super(ride ? ride.id : null)
    if (!ride) return
    this.about = ride.about
    const details = ride.details
    this.content = {
      fromLocation: details.fromLocation,
      toLocation: details.toLocation,
      actualSeats: details.actualSeats,
      seatsFilled: details.seatsFilled,
      startTime: details.startTime,
      duration: details.duration,
    }
  }
}
