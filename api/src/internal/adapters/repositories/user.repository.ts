import { Pool, QueryResultRow } from 'pg'
import { BaseRepository } from './base.repository'
import { IUser, IUserRole } from '@shared/types/auth'
import { IUserEntity } from './types/user'
console.log("=====", )
export const mapUserRoleToEntity = (role: IUserRole): IUserRole => {
  switch (role) {
    case IUserRole.ADMIN:
      return IUserRole.ADMIN
    case IUserRole.MEMBER:
      return IUserRole.MEMBER
    default:
      throw new Error('Invalid role')
  }
}

export class UserRepository extends BaseRepository<IUserEntity> {
  constructor(pool: Pool) {
    super(pool, 'users')
  }

  private toRow(user: Partial<IUserEntity>): Partial<QueryResultRow> {
    const row: Partial<QueryResultRow> = {}

    if (user.id !== undefined) {
      row.id = user.id
    }
    if (user.firstName !== undefined) {
      row.first_name = user.firstName
    }
    if (user.lastName !== undefined) {
      row.last_name = user.lastName
    }
    if (user.phoneNumber !== undefined) {
      row.phone_number = user.phoneNumber
    }
    if (user.email !== undefined) {
      row.email = user.email
    }
    if (user.password !== undefined) {
      row.password = user.password
    }
    if (user.pic !== undefined) {
      row.pic = user.pic
    }
    if (user.role !== undefined) {
      row.role = user.role
    }
    if (user.passwordChangedAt !== undefined) {
      row.password_changed_at = user.passwordChangedAt
    }
    return row
  }

  private fromRow(row: QueryResultRow): IUserEntity {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      phoneNumber: row.phone_number,
      email: row.email,
      password: row.password,
      passwordChangedAt: row.password_changed_at
        ? new Date(row.password_changed_at)
        : undefined,
      pic: row.pic,
      role: row.role,
    }
  }

  public async createUser(
    item: Omit<IUserEntity, 'id'>,
  ): Promise<IUser | null> {
    const row = await super.create(this.toRow(item))
    return row ? this.fromRow(row) : null
  }

  public async findByID(id: string): Promise<IUserEntity | null> {
    const row = await super.findByID(id)
    return row ? this.fromRow(row) : null
  }

  public async findByEmail(email: string): Promise<IUserEntity | null> {
    const rows = await super.findAllByColumn('email', email)
    return !!rows[0] ? this.fromRow(rows[0]) : null
  }
}
