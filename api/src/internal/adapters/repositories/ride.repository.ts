import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { IPost, IRide, IRideType } from '../../domain/types'
import { IPlaceDetails } from '../../../shared/utils/googleMaps'
import { UUID } from 'crypto'

interface IFindRidesParams {
  fromLocation: IPlaceDetails
  toLocation: IPlaceDetails
  startDate: string
  endDate: string
}

interface IRideEntity {
  fromLocationID: string
  toLocationID: string
  actualSeats: number
  seatsFilled: number
  startTime: string
  duration: number
}
export class RideRepository extends BaseRepository<IPost<IRide>> {
  constructor(pool: Pool) {
    super(pool, 'rides')
  }
  private fromRow(row: QueryResultRow): IPost<IRide> {
    return {
      id: row.id,
      host: {
        id: row.host_id,
        firstName: row.first_name,
        lastName: row.last_name,
        pic: row.user_pic,
      },
      type: IRideType.RIDE,
      about: row.details,
      details: {
        fromLocation: {
          googlePlaceID: row.start_place_id,
          neighborhood: row.start_neighborhood,
          locality: row.start_locality,
          city: row.start_city,
        },
        toLocation: {
          googlePlaceID: row.end_place_id,
          neighborhood: row.end_neighborhood,
          locality: row.end_locality,
          city: row.end_city,
        },
        actualSeats: row.actual_seats,
        seatsFilled: row.seats_filled,
        startTime: row.start_time,
        duration: row.duration,
      },
      currUserReqStatus: row.request_status,
    }
  }

  private toRow(
    ride: Partial<IPost<Partial<IRideEntity>>>,
  ): Partial<QueryResultRow> {
    const row: Partial<QueryResultRow> = {}

    if (ride.id !== undefined) {
      row.id = ride.id
    }
    if (ride.host?.id !== undefined) {
      row.host_id = ride.host.id
    }
    if (ride.about !== undefined) {
      row.about = ride.about
    }
    if (ride.details?.fromLocationID !== undefined) {
      row.from_location_id = ride.details.fromLocationID
    }
    if (ride.details?.toLocationID !== undefined) {
      row.to_location_id = ride.details.toLocationID
    }
    if (ride.details?.actualSeats !== undefined) {
      row.actual_seats = ride.details.actualSeats
    }
    if (ride.details?.seatsFilled !== undefined) {
      row.seats_filled = ride.details.seatsFilled
    }
    if (ride.details?.startTime !== undefined) {
      row.start_time = ride.details.startTime
    }
    if (ride.details?.duration !== undefined) {
      row.end_time = ride.details.duration
    }
    if (ride.currUserReqStatus !== undefined) {
      row.currUserReqStatus = ride.currUserReqStatus
    }

    return row
  }

  public async create(
    item: Omit<
      IPost<Omit<IRideEntity, 'seatsFilled'>>,
      'id' | 'type' | 'currUserReqStatus'
    >,
  ): Promise<IPost<IRide> | null> {
    const row = await super.create(this.toRow(item))
    return row ? this.fromRow(row) : null
  }

  public async reduceSeatFilled(rideID: UUID): Promise<void> {
    const query = `
    UPDATE rides
    SET seats_filled = seats_filled - 1
    WHERE id = $1 AND seats_filled > 0
  `
    await this.pool.query(query, [rideID])
  }

  public async findRideByID(
    id: string,
    requesterID: string, // to get the currUserReqStatus
  ): Promise<IPost<IRide> | null> {
    const query = `
      SELECT r.*, 
             u.id AS host_id, 
             u.first_name AS first_name, 
             u.last_name AS last_name,
             u.pic AS user_pic,
             startLoc.google_place_id AS start_place_id, 
             startLoc.neighborhood AS start_neighborhood, 
             startLoc.locality AS start_locality, 
             startLoc.city AS start_city, 
             endLoc.google_place_id AS end_place_id,
             endLoc.neighborhood AS end_neighborhood, 
             endLoc.locality AS end_locality, 
             endLoc.city AS end_city,
             rr.status AS request_status
      FROM rides r
      JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
      JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
      JOIN users u ON r.host_id = u.id
      LEFT JOIN ride_requests rr ON rr.ride_id = r.id AND rr.requester_id = $2
      WHERE r.id = $1
    `

    const { rows } = await this.pool.query(query, [id, requesterID])
    const row = rows[0]

    return row ? this.fromRow(row) : null
  }

  public async findRidesByUserID(userID: UUID): Promise<IPost<IRide>[] | null> {
    let query = `
      SELECT r.*, 
            u.id AS host_id, 
            u.first_name AS first_name, 
            u.last_name AS last_name,
            u.pic AS user_pic,
            startLoc.google_place_id AS start_place_id, 
            startLoc.neighborhood AS start_neighborhood, 
            startLoc.locality AS start_locality, 
            startLoc.city AS start_city, 
            endLoc.google_place_id AS end_place_id, 
            endLoc.neighborhood AS end_neighborhood, 
            endLoc.locality AS end_locality, 
            endLoc.city AS end_city,
            rr.status AS request_status
      FROM rides r
      JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
      JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
      JOIN users u ON r.host_id = u.id
      LEFT JOIN ride_requests rr ON rr.ride_id = r.id AND rr.requester_id = $1
      WHERE u.id = $1
    `
    const { rows } = await this.pool.query(query, [userID])

    return rows.length > 0 ? rows.map(this.fromRow) : []
  }

  public async findRides(
    { fromLocation, toLocation, startDate, endDate }: IFindRidesParams,
    userID: string,
  ): Promise<IPost<IRide>[]> {
    const params: any[] = []
    let conditions: string[] = []
    const locationParams: { [key: string]: number } = {}
    fromLocation.city = ''
    fromLocation.neighborhood = ''

    let query = `
      SELECT r.*, 
            u.id AS host_id, 
            u.first_name AS first_name, 
            u.last_name AS last_name,
            u.pic AS user_pic,
            startLoc.google_place_id AS start_place_id, 
            startLoc.neighborhood AS start_neighborhood, 
            startLoc.locality AS start_locality, 
            startLoc.city AS start_city, 
            endLoc.google_place_id AS end_place_id, 
            endLoc.neighborhood AS end_neighborhood, 
            endLoc.locality AS end_locality, 
            endLoc.city AS end_city,
            rr.status AS request_status
      FROM rides r
      JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
      JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
      JOIN users u ON r.host_id = u.id
      LEFT JOIN ride_requests rr ON rr.ride_id = r.id AND rr.requester_id = $1
      WHERE 1 = 1
    `

    params.push(userID)
    if (fromLocation.neighborhood && toLocation.neighborhood) {
      conditions.push(
        ` (startLoc.neighborhood = $${params.length + 1} AND endLoc.neighborhood = $${params.length + 2})`,
      )
      params.push(fromLocation.neighborhood, toLocation.neighborhood)
    }

    if (fromLocation.neighborhood && toLocation.locality) {
      conditions.push(
        ` (startLoc.neighborhood = $${params.length + 1} AND endLoc.locality = $${params.length + 2})`,
      )
      params.push(fromLocation.neighborhood, toLocation.locality)
    }

    if (fromLocation.locality && toLocation.locality) {
      conditions.push(
        ` (startLoc.locality = $${params.length + 1} AND endLoc.locality = $${params.length + 2})`,
      )
      params.push(fromLocation.locality, toLocation.locality)
    }

    if (fromLocation.locality && toLocation.city) {
      conditions.push(
        ` (startLoc.locality = $${params.length + 1} AND endLoc.city = $${params.length + 2})`,
      )
      params.push(fromLocation.locality, toLocation.city)
    }

    if (fromLocation.city && toLocation.city) {
      conditions.push(
        ` (startLoc.city = $${params.length + 1} AND endLoc.city = $${params.length + 2})`,
      )
      params.push(fromLocation.city, toLocation.city)
    }
    query += ` AND ${conditions.join(' OR ')}`

    if (startDate && endDate) {
      query += ` AND r.start_time >= $${params.length + 1} AND r.start_time < $${params.length + 2}`
      params.push(startDate, endDate)
    }
    const result = await this.pool.query(query, params)
    return result.rows.map(this.fromRow)
  }
}
