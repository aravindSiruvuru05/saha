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
  // Create rides table with location references
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
    about: {
      type: 'varchar',
    },
    from_location_id: {
      type: 'text',
      notNull: true,
      references: {
        name: 'locations', // Name of the referenced table
        column: 'google_location_id', // Specific column in the referenced table
      },
      onDelete: 'RESTRICT', // Prevent deletion if referenced
    },
    to_location_id: {
      type: 'text',
      notNull: true,
      references: {
        name: 'locations', // Name of the referenced table
        column: 'google_place_id', // Specific column in the referenced table
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
      type: 'timestamp',
      notNull: true, // Start time of the trip
    },
    duration: {
      type: 'integer',
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
      type: 'timestamp',
      notNull: true,
      default: pgm.func('NOW()'), // Default to current timestamp
    },
  })

  // Create indexes for the rides table
  pgm.createIndex('rides', ['from_location_id'])
  pgm.createIndex('rides', ['to_location_id'])

  // Create the trigger for the rides table
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
  // Drop the indexes first
  pgm.dropIndex('rides', ['from_location_id'])
  pgm.dropIndex('rides', ['to_location_id'])

  // Drop the triggers
  pgm.sql('DROP TRIGGER IF EXISTS set_updated_at ON rides;')

  // Drop the tables
  pgm.dropTable('rides')
}
