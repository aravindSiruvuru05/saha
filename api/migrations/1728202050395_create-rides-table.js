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
  // Create car_pooling table with location references
  pgm.createTable('rides', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true, // Set as primary key
      default: pgm.func('gen_random_uuid()'), // Generates a random UUID
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: {
        name: 'users', // Name of the referenced table
        column: 'id', // Specific column in the referenced table
      },
      onDelete: 'CASCADE', // Optional: specify behavior on delete
    },
    details: {
      type: 'varchar',
    },
    start_location_id: {
      type: 'uuid',
      notNull: true,
      references: {
        name: 'locations', // Name of the referenced table
        column: 'id', // Specific column in the referenced table
      },
      onDelete: 'RESTRICT', // Prevent deletion if referenced
    },
    end_location_id: {
      type: 'uuid',
      notNull: true,
      references: {
        name: 'locations', // Name of the referenced table
        column: 'id', // Specific column in the referenced table
      },
      onDelete: 'RESTRICT', // Prevent deletion if referenced
    },
    actual_seats: {
      type: 'integer',
      notNull: true,
    },
    seats_filled: {
      type: 'integer',
      default: 0,
      notNull: true,
    },
    start_time: {
      type: 'timestamptz',
      notNull: true, // Start time of the trip
    },
    end_time: {
      type: 'timestamptz',
    },
    price: {
      type: 'integer',
    },
    car_model: {
      type: 'varchar',
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

  // Create the trigger for the car_pooling table
  pgm.sql(`
   CREATE TRIGGER set_updated_at
   BEFORE UPDATE ON rides
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
  pgm.sql('DROP TRIGGER IF EXISTS set_updated_at ON rides;')

  pgm.dropTable('rides') // Drop car_pooling table
}
