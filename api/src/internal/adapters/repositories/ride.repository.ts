import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { IPost, IRide, IRideType } from '../../domain/types'
import { Ride } from '../../domain/ride'

export class RideRepository extends BaseRepository<IPost<IRide>> {
  constructor(pool: Pool) {
    super(pool, 'rides')
  }

  private fromRow(row: QueryResultRow): Ride {
    return new Ride({
      id: row.id,
      userId: row.user_id,
      type: IRideType.RIDE,
      details: row.details,
      content: {
        startLocationId: row.start_location_id,
        endLocationId: row.end_location_id,
        totalSeatsAvailable: row.total_seats_available,
        totalSeatsFilled: row.total_seats_filled,
        startTime: row.start_time,
        endTime: row.end_time,
      },
    })
  }

  public async create(item: Omit<IPost<IRide>, 'id'>): Promise<Ride | null> {
    const row = await super.create(item)
    return row ? this.fromRow(row) : null
  }

  public async findByID(id: string): Promise<Ride | null> {
    const row = await super.findByID(id)
    return row ? this.fromRow(row) : null
  }

  public async findRidesByUserID(userID: string): Promise<Ride[] | null> {
    const rows = await super.findAllByColumn('user_id', userID)
    return !!rows ? rows.map((r) => this.fromRow(r)) : null
  }
}
