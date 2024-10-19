import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { IUserEntity, IUserRoleEntity } from './types'
import { IUserRole } from '../../domain/types'
import { User } from '../../domain/user'

export const mapUserRoleToEntity = (role: IUserRole): IUserRoleEntity => {
  switch (role) {
    case IUserRole.ADMIN:
      return IUserRoleEntity.ADMIN
    case IUserRole.MEMBER:
      return IUserRoleEntity.MEMBER
    default:
      throw new Error('Invalid role')
  }
}

export class UserRepository extends BaseRepository<IUserEntity> {
  constructor(pool: Pool) {
    super(pool, 'users')
  }

  private fromRow(row: QueryResultRow): User {
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      photo: row.photo,
      role: row.role,
      password: row.password,
      passwordChangedAt: row.password_changed_at
        ? new Date(row.password_changed_at)
        : undefined,
    })
  }

  public async create(item: Omit<IUserEntity, 'id'>): Promise<User | null> {
    const row = await super.create(item)
    return row ? this.fromRow(row) : null
  }

  public async findByID(id: string): Promise<User | null> {
    const row = await super.findByID(id)
    return row ? this.fromRow(row) : null
  }

  public async findByEmail(email: string): Promise<User | null> {
    const rows = await super.findAllByColumn('email', email)
    return !!rows[0] ? this.fromRow(rows[0]) : null
  }
}
