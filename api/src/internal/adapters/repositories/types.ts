export enum IUserRoleEntity {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export interface IUserEntity {
  id: string
  name: string
  email: string
  photo?: string
  role: IUserRoleEntity
  password: string
  passwordChangedAt?: string
}
