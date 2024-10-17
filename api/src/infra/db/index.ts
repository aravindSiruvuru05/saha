import { Pool } from 'pg'
import migrate from 'node-pg-migrate'
import path from 'path'

console.log(process.env.DB_HOST, process.env.DB_NAME, process.env.NODE_ENV)
const DB_CONFIG = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
}
console.log(DB_CONFIG, '====')
// Create a connection pool
const pool = new Pool(DB_CONFIG)

// Event listeners to monitor connection status
pool.on('connect', (client) => {
  console.log('Client connected to the pool')
})

pool.on('acquire', (client) => {
  console.log('Client acquired from the pool')
})

pool.on('remove', (client) => {
  console.log('Client removed from the pool')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

pool.connect(async (err, client, release) => {
  if (err || !client) {
    console.error('Error acquiring client:', err?.stack)
    return
  }
  console.log('Acquired client')

  try {
    // Test query to check if the connection is alive
    const res = await client.query('SELECT 1')
    console.log('Test query successful:', res.rows)

    // Construct the database URL from DB_CONFIG
    const databaseUrl = `postgres://${DB_CONFIG.user}:${DB_CONFIG.password}@${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`

    // Run migrations
    await migrate({
      databaseUrl, // Pass the constructed database URL
      dir: path.join(__dirname, '../../../migrations'), // Directory where your migration files are located
      migrationsTable: 'pg_migrations', // Optional, table to track migrations
      dryRun: false, // Set to true for testing
      direction: 'up',
    })
    console.log('Migrate Up completed successfully.')
  } catch (err) {
    console.error('Error during migration or query execution:', err)
  } finally {
    // Release the client back to the pool
    release()
  }
})

// Export the pool
export default pool
