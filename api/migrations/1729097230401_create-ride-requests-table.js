/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create the enum type for booking status
  pgm.createType('booking_status_enum', [
    'pending',
    'accepted',
    'declined',
    'canceled',
  ])

  // Create ride_requests table for ride bookings
  pgm.createTable('ride_requests', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true, // Set as primary key
      default: pgm.func('gen_random_uuid()'), // Generates a random UUID
    },
    ride_id: {
      type: 'uuid',
      notNull: true,
      references: {
        name: 'rides', // Name of the referenced table
        column: 'id', // Specific column in the referenced table
      },
      onDelete: 'CASCADE', // If the ride is deleted, cascade the deletion
    },
    requester_id: {
      type: 'uuid',
      notNull: true,
      references: {
        name: 'users', // Name of the referenced table
        column: 'id', // Specific column in the referenced table
      },
      onDelete: 'CASCADE', // If the user is deleted, cascade the deletion
    },
    status: {
      type: 'booking_status_enum', // Use the enum type for status
      notNull: true,
      default: 'pending', // Default booking status
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'), // Default to current timestamp
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'), // Default to current timestamp
    },
  })

  // Add a composite unique constraint for (user_id, ride_id)
  pgm.addConstraint('ride_requests', 'unique_user_id_ride_id', {
    unique: ['requester_id', 'ride_id'],
  })

  // Create the trigger for the ride_requests table
  pgm.sql(`
    CREATE TRIGGER set_updated_at_ride_requests
    BEFORE UPDATE ON ride_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `)
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the trigger first
  pgm.sql(
    'DROP TRIGGER IF EXISTS set_updated_at_ride_requests ON ride_requests;',
  )

  // Drop the unique constraint
  pgm.dropConstraint('ride_requests', 'unique_user_id_ride_id')

  // Drop the ride_requests table
  pgm.dropTable('ride_requests')

  // Drop the enum type
  pgm.dropType('booking_status_enum')
}
