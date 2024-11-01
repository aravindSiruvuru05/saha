import { Request } from 'express'
import bcrypt from 'bcryptjs'
import { mapUserRoleToEntity } from '../adapters/repositories/user.repository'
import { hashPassword } from '../../shared/utils'
import { IUser } from '@shared/types/auth'
import { IUserEntity } from '../adapters/repositories/types/user'

export const getUserByEmail = async (
  req: Request,
  email: IUser['email'],
): Promise<IUserEntity | null> => {
  const user = await req.repositories.user.findByEmail(email)
  return user
}

export const createUser = async (
  req: Request,
  user: Omit<IUserEntity, 'id' | 'pic'>,
): Promise<IUser | null> => {
  if (!user.password) return null

  const hashedPassword = await hashPassword(user.password)
  const newUser = await req.repositories.user.createUser({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: mapUserRoleToEntity(user.role),
    password: hashedPassword,
  })

  return newUser
}

export const findByID = async (
  req: Request,
  id: string,
): Promise<IUserEntity | null> => {
  const user = await req.repositories.user.findByID(id)
  return user
}

export const changePasswordAfter = (
  jwtTimestamp: number,
  passwordChangedAt?: Date,
) => {
  if (passwordChangedAt) {
    const changedTimeStamp = parseInt(
      (passwordChangedAt.getTime() / 1000).toString(),
      10,
    )
    return jwtTimestamp < changedTimeStamp
  }
  return false
}

export const isCorrectPassword = async (
  candidatePassword: string,
  userPassword: string,
) => {
  return await bcrypt.compare(candidatePassword, userPassword)
}
