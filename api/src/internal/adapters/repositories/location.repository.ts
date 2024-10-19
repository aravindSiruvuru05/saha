import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { Location } from '../../domain/location'

export class LocationRepository extends BaseRepository<Location> {
  constructor(pool: Pool) {
    super(pool, 'locations')
  }

  private fromRow(row: QueryResultRow): Location {
    return new Location({
      id: row.id,
      name: row.name,
    })
  }

  private toRow(location: Partial<Location>): Partial<QueryResultRow> {
    const row: Partial<QueryResultRow> = {}

    if (location.id !== undefined) {
      row.id = location.id
    }
    if (location.name !== undefined) {
      row.name = location.name
    }
    console.log(row, '===')
    return row
  }

  public async getOrCreate(
    item: Omit<Location, 'id'>,
  ): Promise<Location | null> {
    const existingLocations = await super.findAllByColumn('name', item.name)
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
    item: Partial<Location>,
  ): Promise<Location | null> {
    const row = await super.update(id, this.toRow(item))
    return row ? this.fromRow(row) : null
  }

  public async delete(id: string): Promise<boolean> {
    return super.delete(id)
  }
}
