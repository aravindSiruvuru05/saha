import { UUID } from 'crypto'
import { IWithId } from './types'

export abstract class BaseModel<T extends IWithId> {
  public id!: UUID

  constructor(id: UUID | null) {
    if (!id) return
    this.id = id
  }
}
