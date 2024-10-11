import { IPost } from '../domain/types'
import { User } from '../domain/user'

const createPost = async (
  req: Request,
  post: Omit<IPost, 'id'>,
): Promise<User | null> => {
  //   const hashedPassword = await hashPassword(user.password)

  //   const newUser = await req.repositories.user.create({
  //     name: user.name,
  //     email: user.email,
  //     role: mapUserRoleToEntity(user.role),
  //     password: hashedPassword,
  //   })
  return null
}
