import { ILocation } from '../adapters/controllers/types'
import { BaseModel } from './base.model'

export class Location {
  private static instance: Location

  public googlePlaceID!: string
  public neighborhood!: string
  public locality!: string
  public city!: string

  constructor(location?: ILocation) {
    if (!location) return
    this.googlePlaceID = location.googlePlaceID
    this.neighborhood = location.neighborhood
    this.locality = location.locality
    this.city = location.city
  }
}
