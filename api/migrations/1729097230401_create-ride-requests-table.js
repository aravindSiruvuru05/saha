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
  pgm.createType('request_status_enum', [
    'pending',
    'accepted',
    'declined',
    'canceled',
  ])

  pgm.createTable('ride_requests', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    ride_id: {
      type: 'uuid',
      notNull: true,
      references: {
        name: 'rides',
        column: 'id',
      },
      onDelete: 'CASCADE',
    },
    seats: {
      type: 'integer',
      default: 1,
      notNull: true,
    },
    passenger_id: {
      type: 'uuid',
      notNull: true,
      references: {
        name: 'users',
        column: 'id',
      },
      onDelete: 'CASCADE',
    },
    status: {
      type: 'request_status_enum',
      notNull: true,
      default: 'pending',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  })

  pgm.addConstraint('ride_requests', 'unique_user_id_ride_id', {
    unique: ['requester_id', 'ride_id'],
  })

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
  pgm.sql(
    'DROP TRIGGER IF EXISTS set_updated_at_ride_requests ON ride_requests;',
  )

  pgm.dropConstraint('ride_requests', 'unique_user_id_ride_id')

  pgm.dropTable('ride_requests')

  pgm.dropType('request_status_enum')
}
