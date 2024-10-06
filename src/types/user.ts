export type TParamsGetUsers = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TCreateUser = {
  password: string
  firstName?: string
  middleName?: string
  lastName?: string
  email: string
  role: string
  phoneNumber: string
  address?: string
  avatar?: string
  status?: number
  city?: string
}

export type TDeleteUser = {
  name: string
  id: string
}

export type TEditUser = {
  id: string
  password?: string
  firstName?: string
  middleName?: string
  lastName?: string
  email: string
  role: string
  phoneNumber: string
  address?: string
  avatar?: string
  status?: number
  city?: string
}

export type TParamsDeleteMultipleUser = {
  userIds: string[]
}
