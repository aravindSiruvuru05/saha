import { Pool } from 'pg'

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
})

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

pool.connect((err, client, release) => {
  if (err || !client) {
    console.error('Error acquiring client:', err?.stack)
    return
  }

  console.log('Acquired client')
  client.query('SELECT 1', (err, res) => {
    if (err) {
      console.error('Error executing query:', err)
    } else {
      console.log('Test query successful:', res.rows)
    }
    // Release the client back to the pool
    release()
  })
})

// Export the pool
export default pool
