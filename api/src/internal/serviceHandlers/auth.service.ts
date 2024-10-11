import { Request } from 'express'
import { User } from '../domain/user'
import { mapUserRoleToEntity } from '../adapters/repositories/user.repository'
import { hashPassword } from '../../shared/utils'
import { IUser } from '../domain/types'

const getUserByEmail = async (
  req: Request,
  email: IUser['email'],
): Promise<User | null> => {
  const user = await req.repositories.user.findByEmail(email)
  return user
}

const createUser = async (
  req: Request,
  user: Omit<IUser, 'id'>,
): Promise<User | null> => {
  if (!user.password) return null

  const hashedPassword = await hashPassword(user.password)
  const newUser = await req.repositories.user.create({
    name: user.name,
    email: user.email,
    role: mapUserRoleToEntity(user.role),
    password: hashedPassword,
  })

  return newUser
}

const findByID = async (req: Request, id: string): Promise<User | null> => {
  const user = await req.repositories.user.findByID(id)
  return user
}

export { getUserByEmail, createUser, findByID }
