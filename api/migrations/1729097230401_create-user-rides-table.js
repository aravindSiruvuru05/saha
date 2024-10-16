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
  pgm.createType('booking_status_enum', ['pending', 'confirmed', 'rejected'])

  // Create user_rides table for ride bookings
  pgm.createTable('user_rides', {
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
    user_id: {
      type: 'uuid',
      notNull: true,
      references: {
        name: 'users', // Name of the referenced table
        column: 'id', // Specific column in the referenced table
      },
      onDelete: 'CASCADE', // If the user is deleted, cascade the deletion
    },
    // seats_booked: {
    //   type: 'integer',
    //   notNull: true, // Number of seats booked
    // },
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

  // Create the trigger for the user_rides table
  pgm.sql(`
   CREATE TRIGGER set_updated_at_user_rides
   BEFORE UPDATE ON user_rides
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
  pgm.sql('DROP TRIGGER IF EXISTS set_updated_at_user_rides ON user_rides;')

  pgm.dropTable('user_rides') // Drop user_rides table

  // Drop the enum type
  pgm.dropType('booking_status_enum')
}
