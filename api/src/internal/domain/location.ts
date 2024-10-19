import { BaseModel } from './base.model'

export class Location extends BaseModel<Location> {
  private static instance: Location

  public name!: string

  constructor(location?: Location) {
    super(location ? location.id : null)
    if (!location) return
    this.name = location.name
  }
}
