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
  // Create locations table
  pgm.createTable('locations', {
    google_place_id: {
      type: 'text',
      primaryKey: true,
      notNull: true,
    },
    neighborhood: {
      type: 'text',
    },
    locality: {
      type: 'text',
    },
    city: {
      type: 'text',
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

  // Create indexes for the locations table
  pgm.createIndex('locations', ['neighborhood'])
  pgm.createIndex('locations', ['locality'])
  pgm.createIndex('locations', ['city'])
  // Create a composite index on neighborhood, locality, and city
  pgm.createIndex('locations', ['neighborhood', 'locality', 'city'])

  // Create the trigger for the locations table
  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON locations
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
  pgm.dropIndex('locations', ['neighborhood'])
  pgm.dropIndex('locations', ['locality'])
  pgm.dropIndex('locations', ['city'])
  pgm.dropIndex('locations', ['neighborhood', 'locality', 'city'])

  // Drop the triggers
  pgm.sql('DROP TRIGGER IF EXISTS set_updated_at ON locations;')

  // Drop the tables
  pgm.dropTable('locations')
}
