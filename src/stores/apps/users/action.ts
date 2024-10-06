import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUser, getAllUsers, updateUser, deleteUser, deleteMultipleUser } from 'src/services/user'
import { TCreateUser, TEditUser, TParamsDeleteMultipleUser, TParamsGetUsers } from 'src/types/user'

export const serviceName = 'user'

export const getAllUserAsync = createAsyncThunk(`${serviceName}/get-all`, async (data: { params: TParamsGetUsers }) => {
  const response = await getAllUsers(data)

  return response
})

export const createUserAsync = createAsyncThunk(`${serviceName}/create`, async (data: TCreateUser) => {
  const response = await createUser(data)

  return response
})

export const updateUserAsync = createAsyncThunk(`${serviceName}/update`, async (data: TEditUser) => {
  const response = await updateUser(data)

  return response
})

export const deleteUserAsync = createAsyncThunk(`${serviceName}/delete`, async (id: string) => {
  const response = await deleteUser(id)

  return response
})

export const deleteMultipleUserAsync = createAsyncThunk(`${serviceName}/delete-many`, async(data: TParamsDeleteMultipleUser) => {
  const response = await deleteMultipleUser(data)

  return response
})
