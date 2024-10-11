import { IWithId } from './types'

export abstract class BaseModel<T extends IWithId> {
  public id!: string

  constructor(id: string | null) {
    if (!id) return
    this.id = id
  }
}
