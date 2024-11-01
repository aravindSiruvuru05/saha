import { IPlaceDetails } from '@shared/types/google_place'

export class Location {
  private static instance: Location

  public googlePlaceID!: string
  public neighborhood!: string
  public locality!: string
  public city!: string

  constructor(location?: IPlaceDetails) {
    if (!location) return
    this.googlePlaceID = location.googlePlaceID
    this.neighborhood = location.neighborhood
    this.locality = location.locality
    this.city = location.city
  }
}
