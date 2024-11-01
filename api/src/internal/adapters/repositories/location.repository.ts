import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { Location } from '../../domain/location'
import { IPlaceDetails } from '@shared/types/google_place'

export class LocationRepository extends BaseRepository<IPlaceDetails> {
  constructor(pool: Pool) {
    super(pool, 'locations')
  }

  private fromRow(row: QueryResultRow): Location {
    return new Location({
      googlePlaceID: row.google_place_id,
      neighborhood: row.neighborhood,
      locality: row.locality,
      city: row.city,
    })
  }

  private toRow(location: Partial<IPlaceDetails>): Partial<QueryResultRow> {
    const row: Partial<QueryResultRow> = {}

    if (location.googlePlaceID !== undefined) {
      row.google_place_id = location.googlePlaceID
    }
    if (location.neighborhood !== undefined) {
      row.neighborhood = location.neighborhood
    }
    if (location.city !== undefined) {
      row.city = location.city
    }
    if (location.locality !== undefined) {
      row.locality = location.locality
    }
    return row
  }

  public async getOrCreate(
    item: Omit<IPlaceDetails, 'id'>,
  ): Promise<Location | null> {
    const existingLocations = await super.findAllByColumn(
      'google_place_id',
      item.googlePlaceID,
    )
    if (existingLocations && existingLocations.length > 0) {
      return this.fromRow(existingLocations[0])
    }
    const row = await super.create(this.toRow(item))
    return row ? this.fromRow(row) : null
  }

  public async findByID(id: string): Promise<Location | null> {
    const row = await super.findByID(id)
    return row ? this.fromRow(row) : null
  }

  public async update(
    id: string,
    item: Partial<IPlaceDetails>,
  ): Promise<Location | null> {
    const row = await super.update(id, this.toRow(item))
    return row ? this.fromRow(row) : null
  }

  public async delete(id: string): Promise<boolean> {
    return super.delete(id)
  }
}
