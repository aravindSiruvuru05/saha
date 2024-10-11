// base.model.ts
import { Pool, QueryResult, QueryResultRow } from 'pg'
import { v4 as uuidv4 } from 'uuid'

export abstract class BaseRepository<T, R = QueryResultRow> {
  protected pool: Pool
  protected tableName: string

  constructor(pool: Pool, tableName: string) {
    this.pool = pool
    this.tableName = tableName
  }

  // Create a new record
  // here the return is QueryResult but these should not be used directly to query but only used in parent class to return actual domain
  protected async create(item: Omit<T, 'id'>): Promise<R | null> {
    // Generate a UUID for the id field
    const id = uuidv4()

    const newItem = { ...item, id } as {}

    // Get the keys of the new item, ensuring it's treated as a generic object
    const columns = Object.keys(newItem)
      .filter((key) => key !== 'id')
      .join(', ')
    const values = Object.values(newItem).filter(
      (_, index) => Object.keys(newItem)[index] !== 'id',
    )
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')

    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`
    const result = await this.pool.query(query, values)
    return result.rows[0] // Return the created record
  }

  // Read a record by ID
  protected async findByID(id: string): Promise<R | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
    const result = await this.pool.query(query, [id])
    return result.rows[0] || null
  }

  // Update a record by ID
  protected async update(
    id: string,
    updatedItem: Partial<T>,
  ): Promise<R | null> {
    const updates = Object.keys(updatedItem)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ')

    const values = Object.values(updatedItem)
    const query = `UPDATE ${this.tableName} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`
    const result = await this.pool.query(query, [...values, id])
    return result.rows[0] || null
  }

  // Delete a record by ID
  protected async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`
    const result = await this.pool.query(query, [id])
    return !!result.rowCount && result.rowCount > 0
  }

  // Get all records
  protected async getAll(): Promise<R[]> {
    const query = `SELECT * FROM ${this.tableName}`
    const result = await this.pool.query(query)
    return result.rows
  }
}
