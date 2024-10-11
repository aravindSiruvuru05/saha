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
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true, // Set as primary key
      default: pgm.func('gen_random_uuid()'), // Generates a random UUID
    },
    name: {
      type: 'text',
      notNull: true, // Ensure the name of the location is provided
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

  // Create the trigger for the orders table
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
  // Drop the trigger first
  pgm.sql('DROP TRIGGER IF EXISTS set_updated_at ON locations;')

  pgm.dropTable('locations') // Drop locations table
}
