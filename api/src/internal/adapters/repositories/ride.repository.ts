import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { IPlaceDetails } from '../../../shared/utils/googleMaps'
import { UUID } from 'crypto'
import { IRideEntity } from '../../types/rides'
import { IPost, PostType } from '@shared/types/post'
import { IRide, RideType } from '@shared/types/rides'
import {
  findRideByID,
  findRidesByUserIDQuery,
  findRidesQuery,
  reduceSeatsFilledQuery,
} from './queries/rides'

interface IFindRidesParams {
  fromLocation: IPlaceDetails
  toLocation: IPlaceDetails
  startDate: string
  endDate: string
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
        phoneNumber: row.phone_number,
        email: row.email,
        role: row.role,
      },
      type: PostType.RIDE,
      about: row.details,
      details: {
        passengers: [],
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
        distance: row.distance,
        type: row.type == RideType.HOST ? RideType.HOST : RideType.PASSENGER,
      },
      currUserReqStatus: row.request_status,
    }
  }

  public async create(item: Omit<IRideEntity, 'id'>): Promise<IPost<IRide>> {
    const row = await super.create(item)
    return this.fromRow(row)
  }

  public async reduceSeatFilled(rideID: UUID): Promise<IPost<IRide>> {
    const { rows } = await this.pool.query(reduceSeatsFilledQuery, [rideID])
    console.log(rows, '======reduce seats')
    return this.fromRow(rows[0])
  }

  public async findRideByID(
    id: string,
    requesterID: string,
  ): Promise<IPost<IRide> | null> {
    const { rows } = await this.pool.query(findRideByID, [id, requesterID])
    const row = rows[0]

    return row ? this.fromRow(row) : null
  }

  public async findRidesByUserID(userID: UUID): Promise<IPost<IRide>[]> {
    const { rows } = await this.pool.query(findRidesByUserIDQuery, [userID])
    return rows.map(this.fromRow)
  }

  public async searchRides(
    { fromLocation, toLocation, startDate, endDate }: IFindRidesParams,
    requesterID: string,
  ): Promise<IPost<IRide>[]> {
    const params: any[] = []
    let conditions: string[] = []
    fromLocation.city = ''
    fromLocation.neighborhood = ''

    let query = findRidesQuery

    params.push(requesterID)
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
    query += ` ORDER BY r.start_time DESC`
    const result = await this.pool.query(query, params)
    return result.rows.map(this.fromRow)
  }
}
