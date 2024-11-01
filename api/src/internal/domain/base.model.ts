import { IWithID } from '@shared/types'
import { UUID } from 'crypto'

export abstract class BaseModel<T extends IWithID> {
  public id!: UUID

  constructor(id: UUID | null) {
    if (!id) return
    this.id = id
  }
}
