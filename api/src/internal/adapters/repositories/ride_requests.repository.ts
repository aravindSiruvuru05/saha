import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { UUID } from 'crypto'
import { IRideRequest, RideRequestStatus } from './types'

export class RideRequestsRepository extends BaseRepository<IRideRequest> {
  constructor(pool: Pool) {
    super(pool, 'ride_requests')
  }

  private fromRow(row: QueryResultRow): IRideRequest {
    return {
      id: row.id,
      userID: row.user_id,
      rideID: row.ride_id,
      status: row.status,
    }
  }

  private toRow(rideRequest: Partial<IRideRequest>): Partial<QueryResultRow> {
    const row: Partial<QueryResultRow> = {}

    if (rideRequest.id !== undefined) {
      row.id = rideRequest.id
    }
    if (rideRequest.rideID !== undefined) {
      row.ride_id = rideRequest.rideID
    }
    if (rideRequest.userID !== undefined) {
      row.user_id = rideRequest.userID
    }
    if (rideRequest.status !== undefined) {
      row.status = rideRequest.status
    }

    return row
  }

  public async joinRide(
    rideID: UUID,
    userID: UUID,
  ): Promise<IRideRequest | null> {
    const row = await super.create(this.toRow({ rideID, userID }))

    return row ? this.fromRow(row) : null
  }

  public async acceptRequest(
    rideID: UUID,
    userID: UUID,
  ): Promise<IRideRequest | null> {
    const client = await this.pool.connect()

    try {
      // Begin the transaction
      await client.query('BEGIN')

      // Update the ride request status to ACCEPTED
      const updateRequestQuery = `
        UPDATE ride_requests
        SET status = $1
        WHERE ride_id = $2 AND user_id = $3
        RETURNING *
      `
      const { rows: requestRows } = await client.query(updateRequestQuery, [
        RideRequestStatus.ACCEPTED,
        rideID,
        userID,
      ])
      const requestRow = requestRows[0]

      if (!requestRow) {
        // If no ride request was updated, rollback the transaction and return null
        await client.query('ROLLBACK')
        return null
      }

      // Increment seats_filled in the rides table
      const updateSeatsQuery = `
        UPDATE rides
        SET seats_filled = seats_filled + 1
        WHERE id = $1
      `
      await client.query(updateSeatsQuery, [rideID])

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

  public async declineRequest(
    rideID: UUID,
    userID: UUID,
  ): Promise<IRideRequest | null> {
    const query = `
      UPDATE ride_requests
      SET status = $1
      WHERE ride_id = $2 AND user_id = $3
      RETURNING *
    `
    const { rows } = await this.pool.query(query, [
      RideRequestStatus.DECLINED,
      rideID,
      userID,
    ])
    const row = rows[0]

    return row ? this.fromRow(row) : null
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
    const rows = await super.findAllByColumn('ride_id', rideID)

    return rows.map(this.fromRow)
  }
}
