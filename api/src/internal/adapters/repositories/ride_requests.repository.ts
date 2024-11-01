import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { UUID } from 'crypto'
import { IRideRequest, RideRequestStatus } from '@shared/types/ride_requests'
import { insertRideQuery } from './queries/rides'
import { IUser } from '@shared/types/auth'
import { PostRequestStatus } from '@shared/types/post'
import {
  ICreateRideAndRideRequestEntity,
  IRideRequestEntity,
} from './types/ride_requets'
import {
  findRideRequestByRequestIDQuery,
  updateRideRequestStatusQuery,
  updateRideSeatsCountQuery,
} from './queries/ride_requests'

export class RideRequestsRepository extends BaseRepository<IRideRequestEntity> {
  constructor(pool: Pool) {
    super(pool, 'ride_requests')
  }

  private fromRow(row: QueryResultRow): IRideRequest {
    return {
      id: row.request_id,
      status: row.request_status,
      requestedSeats: row.requested_seats,
      passenger: {
        id: row.passenger_id,
        firstName: row.passenger_first_name,
        lastName: row.passenger_last_name,
        pic: row.passenger_pic,
        phoneNumber: row.phone_number,
        email: row.email,
        role: row.role,
      },
      post: {
        id: row.ride_id,
        currUserReqStatus: '' as PostRequestStatus,
        type: row.ride_type,
        about: row.about,
        host: {
          id: row.ride_host_id,
        } as IUser,
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
          actualSeats: row.ride_actual_seats,
          seatsFilled: row.ride_seats_filled,
          startTime: row.ride_start_time,
          distance: row.ride_distance,
          type: row.ride_type,
          passengers: [],
        },
      },
    }
  }

  public async findRideRequestByRequestID(
    requestID: string,
  ): Promise<IRideRequest | null> {
    const { rows } = await this.pool.query(findRideRequestByRequestIDQuery, [
      requestID,
    ])
    return rows && rows.length > 0 ? this.fromRow(rows[0]) : null
  }

  public async deleteRequest(requestID: string): Promise<boolean> {
    const isDeleted = await super.delete(requestID)
    return isDeleted
  }

  public async cancelRequest(requestID: string): Promise<IRideRequest | null> {
    const rows = await super.update(requestID, { status: 'canceled' })
    return rows && rows.length > 0 ? this.fromRow(rows[0]) : null
  }

  public async findByUserRideID(
    rideID: string,
    passengerID: string,
  ): Promise<any> {
    const query = `SELECT * FROM ${this.tableName} WHERE ride_id = $1 AND passenger_id = $2`

    const { rows } = await this.pool.query(query, [rideID, passengerID])
    return rows[0]
  }

  public async createRideRequest(
    rideID: string,
    passengerID: UUID,
  ): Promise<IRideRequest> {
    const row = await super.create({
      ride_id: rideID,
      passenger_id: passengerID,
    })
    return this.fromRow(row)
  }

  public async createRideAndRideRequest(
    rideRequest: ICreateRideAndRideRequestEntity,
  ): Promise<IRideRequest | null> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const rideRes = await client.query(insertRideQuery, [
        rideRequest.about,
        rideRequest.fromLocationID,
        rideRequest.toLocationID,
        rideRequest.startTime,
        ,
      ])

      if (!rideRes.rows || rideRes.rows.length === 0) {
        await client.query('ROLLBACK')
        return null
      }

      const rideID = rideRes.rows[0].id

      const insertRequestQuery = `
        INSERT INTO ride_requests (ride_id, passenger_id, status, seats)
        VALUES ($1, $2, $3)
        RETURNING *
      `

      const requestRes = await client.query(insertRequestQuery, [
        rideID,
        rideRequest.passengerID,
        RideRequestStatus.PENDING,
        rideRequest.seats,
      ])

      await client.query('COMMIT')

      return this.fromRow(requestRes.rows[0])
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  public async joinRide(requestID: UUID): Promise<any | null> {
    const row = await super.update(requestID, {
      status: RideRequestStatus.PENDING,
    })
    return row
  }

  public async acceptRequest(requestID: UUID): Promise<IRideRequest | null> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const res = await client.query(updateRideRequestStatusQuery, [
        RideRequestStatus.ACCEPTED,
        requestID,
      ])

      //TODO: check for output here res and update seats filled below dynamically
      if (!res.rows || res.rows.length === 0) {
        await client.query('ROLLBACK')
        return null
      }

      const requestRow = res.rows[0] as QueryResultRow
      await client.query(updateRideSeatsCountQuery, [requestRow.ride_id])
      await client.query('COMMIT')
      return this.fromRow(requestRow)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  public async declineRequest(requestID: UUID): Promise<boolean | null> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')

      const { rows: requestRows } = await client.query(
        updateRideRequestStatusQuery,
        [RideRequestStatus.DECLINED, requestID],
      )
      const requestRow = requestRows[0]

      if (!requestRow) {
        await client.query('ROLLBACK')
        return null
      }

      await client.query('COMMIT')

      return !!requestRow
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  public async withdrawJoin(rideID: UUID, userID: UUID): Promise<boolean> {
    const client = await this.pool.connect()

    try {
      await client.query('BEGIN')
      const deleteRequestQuery = `
        DELETE FROM ride_requests
        WHERE ride_id = $1 AND user_id = $2
        RETURNING *
      `
      const { rows: deletedRows } = await client.query(deleteRequestQuery, [
        rideID,
        userID,
      ])

      if (deletedRows.length === 0) {
        await client.query('ROLLBACK')
        return false
      }

      const updateSeatsQuery = `
        UPDATE rides
        SET seats_filled = seats_filled - 1
        WHERE id = $1
      `
      await client.query(updateSeatsQuery, [rideID])
      await client.query('COMMIT')
      return true
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  public async findRequestsByRideID(rideID: UUID): Promise<IRideRequest[]> {
    const query = `
      SELECT rr.id AS request_id,
          r.id AS ride_id,
          r.start_time AS ride_start_time,
          r.price AS ride_price,
          r.host_id AS ride_host_id,
          r.actual_seats AS ride_actual_seats,
          r.seats_filled AS ride_seats_filled,
          rr.status AS request_status,
          requester.id AS requester_id,
          requester.first_name AS requester_first_name,
          requester.last_name AS requester_last_name,
          requester.pic AS requester_pic,
          startLoc.google_place_id AS start_place_id,
          startLoc.neighborhood AS start_neighborhood,
          startLoc.locality AS start_locality,
          startLoc.city AS start_city,
          endLoc.google_place_id AS end_place_id,
          endLoc.neighborhood AS end_neighborhood,
          endLoc.locality AS end_locality,
          endLoc.city AS end_city
      FROM ride_requests rr
      JOIN rides r ON rr.ride_id = r.id
      JOIN users requester ON rr.requester_id = requester.id
      JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
      JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
      WHERE r.ride_id = $1
    `

    const { rows } = await this.pool.query(query, [rideID])
    return rows && rows.length > 0 ? rows.map(this.fromRow) : []
  }

  public async getPendingRequestsForMyRides(
    userID: string,
  ): Promise<IRideRequest[]> {
    const query = `
      SELECT rr.id AS request_id,
            r.id AS ride_id,
            r.start_time AS ride_start_time,
            r.price AS ride_price,
            r.actual_seats AS ride_actual_seats,
            r.seats_filled AS ride_seats_filled,
            rr.status AS request_status,
            requester.id AS requester_id,
            requester.first_name AS requester_first_name,
            requester.last_name AS requester_last_name,
            requester.pic AS requester_pic,
            startLoc.google_place_id AS start_place_id,
            startLoc.neighborhood AS start_neighborhood,
            startLoc.locality AS start_locality,
            startLoc.city AS start_city,
            endLoc.google_place_id AS end_place_id,
            endLoc.neighborhood AS end_neighborhood,
            endLoc.locality AS end_locality,
            endLoc.city AS end_city
      FROM ride_requests rr
      JOIN rides r ON rr.ride_id = r.id
      JOIN users requester ON rr.requester_id = requester.id
      JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
      JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
      WHERE r.host_id = $1
        AND rr.status = 'pending'
    `

    const { rows } = await this.pool.query(query, [userID])
    return rows && rows.length > 0 ? rows.map(this.fromRow) : []
  }
}
