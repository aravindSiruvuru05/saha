// express.d.ts
import { UserRepository } from '../../internal/adapters/repositories/user.repository'
import { User } from '../../internal/domain/user'
import express from 'express'

declare global {
  namespace Express {
    interface Request {
      currUser: User
      models: {
        user: User
      }
      repositories: {
        user: UserRepository
      }
    }
  }
}
