import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { UUID } from 'crypto'
import { IRideRequestEntity, RideRequestStatus } from './types'
import { IRideRequest } from '../../domain/types'

export class RideRequestsRepository extends BaseRepository<IRideRequestEntity> {
  constructor(pool: Pool) {
    super(pool, 'ride_requests')
  }

  private fromRow(row: QueryResultRow): IRideRequest {
    return {
      id: row.request_id, // Assuming the query result column name is 'request_id'
      ridePost: {
        host: {
          id: row.ride_host_id,
        },
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
          duration: row.duration,
        },
      },
      status: row.request_status, // Assuming the query result column name is 'request_status'
      requester: {
        id: row.requester_id, // Requester user ID
        firstName: row.requester_first_name, // Requester's first name
        lastName: row.requester_last_name, // Requester's last name
        photo: row.requester_pic, // Requester's photo
        pic: row.requester_pic, // Use same field for 'pic' (as in your interface)
      },
    }
  }

  private toRow(
    rideRequest: Partial<IRideRequestEntity>,
  ): Partial<QueryResultRow> {
    const row: Partial<QueryResultRow> = {}

    if (rideRequest.id !== undefined) {
      row.id = rideRequest.id
    }
    if (rideRequest.rideID !== undefined) {
      row.ride_id = rideRequest.rideID
    }
    if (rideRequest.requesterID !== undefined) {
      row.requester_id = rideRequest.requesterID
    }
    if (rideRequest.status !== undefined) {
      row.status = rideRequest.status
    }

    return row
  }

  public async findRideRequestByRequestID(
    requestID: string,
  ): Promise<IRideRequest | null> {
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
      WHERE rr.id = $1
    `

    const { rows } = await this.pool.query(query, [requestID])
    return rows && rows.length > 0 ? this.fromRow(rows[0]) : null
  }

  public async deleteRequest(requestID: string): Promise<any> {
    const res = await super.delete(requestID)
    return res
  }

  public async cancelRequest(requestID: string): Promise<any> {
    const res = await super.update(requestID, { status: 'canceled' })
    return res
  }

  public async findByUserRideID(
    rideID: string,
    requesterID: string,
  ): Promise<any> {
    const query = `SELECT * FROM ${this.tableName} WHERE ride_id = $1 AND requester_id = $2`

    const { rows } = await this.pool.query(query, [rideID, requesterID])
    return rows[0]
  }

  public async createRequest(
    rideID: UUID,
    requesterID: UUID,
  ): Promise<IRideRequest | null> {
    const row = await super.create(this.toRow({ rideID, requesterID }))
    return row ? this.fromRow(row) : null
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
      // Begin the transaction
      await client.query('BEGIN')

      // Update the ride request status to ACCEPTED
      const updateRequestQuery = `
        UPDATE ride_requests
        SET status = $1
        WHERE id = $2
        RETURNING *
      `
      const res = await client.query(updateRequestQuery, [
        RideRequestStatus.ACCEPTED,
        requestID,
      ])
      // Check if the update was successful and if the result contains any rows
      if (!res.rows || res.rows.length === 0) {
        // If no ride request was updated, rollback the transaction and return null
        await client.query('ROLLBACK')
        return null
      }

      const requestRow = res.rows[0]

      // Increment seats_filled in the rides table
      const updateSeatsQuery = `
        UPDATE rides
        SET seats_filled = seats_filled + 1
        WHERE id = $1
      `
      await client.query(updateSeatsQuery, [requestRow.ride_id])

      // Commit the transaction
      await client.query('COMMIT')

      // Return the updated ride request
      return this.fromRow(requestRow)
    } catch (error) {
      // If there's an error, rollback the transaction
      await client.query('ROLLBACK')
      throw error
    } finally {
      // Release the client back to the pool
      client.release()
    }
  }

  public async declineRequest(requestID: UUID): Promise<IRideRequest | null> {
    const client = await this.pool.connect()

    try {
      // Begin the transaction
      await client.query('BEGIN')

      // Update the ride request status to ACCEPTED
      const updateRequestQuery = `
        UPDATE ride_requests
        SET status = $1
        WHERE id = $2
        RETURNING *
      `
      const { rows: requestRows } = await client.query(updateRequestQuery, [
        RideRequestStatus.DECLINED,
        requestID,
      ])
      const requestRow = requestRows[0]

      if (!requestRow) {
        // If no ride request was updated, rollback the transaction and return null
        await client.query('ROLLBACK')
        return null
      }

      // Increment seats_filled in the rides table
      // const updateSeatsQuery = `
      //   UPDATE rides
      //   SET seats_filled = seats_filled +
      //   WHERE id = $1
      // `
      // await client.query(updateSeatsQuery, [requestRow.ride_id])

      // Commit the transaction
      await client.query('COMMIT')

      // Return the updated ride request
      return this.fromRow(requestRow)
    } catch (error) {
      // If there's an error, rollback the transaction
      await client.query('ROLLBACK')
      throw error
    } finally {
      // Release the client back to the pool
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
