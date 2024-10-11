import bcrypt from 'bcryptjs'
import { BaseModel } from './base.model'
import { IPost } from './types'

export class Post extends BaseModel<IPost> {
  public details?: string

  constructor(post?: IPost) {
    super(post ? post.id : null)
    if (!post) return
    this.details = post.details
  }
}
