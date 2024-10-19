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
      about: row.details,
      details: {
        startLocationID: row.start_location_id,
        endLocationID: row.end_location_id,
        actualSeats: row.actual_seats,
        seatsFilled: row.seats_filled,
        startTime: row.start_time,
        duration: row.end_time,
      },
    })
  }

  private toRow(ride: Partial<IPost<Partial<IRide>>>): Partial<QueryResultRow> {
    const row: Partial<QueryResultRow> = {}

    if (ride.id !== undefined) {
      row.id = ride.id
    }
    if (ride.userId !== undefined) {
      row.user_id = ride.userId
    }
    if (ride.about !== undefined) {
      row.about = ride.about
    }
    if (ride.details?.startLocationID !== undefined) {
      row.start_location_id = ride.details.startLocationID
    }
    if (ride.details?.endLocationID !== undefined) {
      row.end_location_id = ride.details.endLocationID
    }
    if (ride.details?.actualSeats !== undefined) {
      row.actual_seats = ride.details.actualSeats
    }
    if (ride.details?.seatsFilled !== undefined) {
      row.total_seats_filled = ride.details.seatsFilled
    }
    if (ride.details?.startTime !== undefined) {
      row.start_time = ride.details.startTime
    }
    if (ride.details?.duration !== undefined) {
      row.end_time = ride.details.duration
    }

    return row
  }

  public async create(
    item: Omit<IPost<Omit<IRide, 'seatsFilled'>>, 'id' | 'type'>,
  ): Promise<Ride | null> {
    const row = await super.create(this.toRow(item))
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
