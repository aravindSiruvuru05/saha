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
  pgm.createType('user_role', ['admin', 'guest', 'member'])

  pgm.createTable('users', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true, // Set as primary key
      default: pgm.func('gen_random_uuid()'), // Generates a random UUID
    },
    name: {
      type: 'varchar(100)', // Max length for name
      notNull: true,
    },
    email: {
      type: 'varchar(100)', // Max length for email
      notNull: true,
      unique: true, // Ensure unique email addresses
    },
    pic: {
      type: 'varchar(100)', // Max length for name
    },
    role: {
      type: 'user_role',
      notNull: true,
      default: 'member',
    },
    password: {
      type: 'varchar(100)',
      notNull: true,
    },
    password_changed_at: {
      type: 'timestamptz',
      notNull: false, // Nullable
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

  // Create the function to update updated_at
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();  -- Set updated_at to the current timestamp
        RETURN NEW;  -- Return the modified row
    END;
    $$ LANGUAGE plpgsql;
  `)

  // Create the trigger for the orders table
  pgm.sql(`
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON users
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
  pgm.sql('DROP TRIGGER IF EXISTS set_updated_at ON users;')

  // Drop the function
  pgm.sql('DROP FUNCTION IF EXISTS update_updated_at_column;')

  pgm.dropTable('users')

  // Drop the enum type if no longer needed by any table at the last
  pgm.dropType('user_role')
}
