import { createAsyncThunk } from '@reduxjs/toolkit'
import { createRole, deleteRole, getAllRoles, updateRole } from 'src/services/role'
import { TCreateRole, TEditRole, TParamsGetRoles } from 'src/types/role'

export const getAllRolesAsync = createAsyncThunk('role/getAllRole', async (data: { params: TParamsGetRoles }) => {
  const response = await getAllRoles(data)
  return response
})

export const createRolesAsync = createAsyncThunk('role/createRole', async (data: TCreateRole) => {
    const response = await createRole(data)
    if (response?.data) {
      return response
    }
    return {
      data: null,
      message: response?.response?.data?.message,
      TypeError: response?.response?.data?.typeError
    }
  })
  

export const updateRolesAsync = createAsyncThunk('role/updateRole', async (data: TEditRole) => {
  const response = await updateRole(data)
  if (response?.data) {
    return response
  }
  return {
    data: null,
    message: response?.response?.data?.message,
    TypeError: response?.response?.data?.typeError
  }
})

export const deleteRolesAsync = createAsyncThunk('role/deleteRole', async (id: string) => {
  const response = await deleteRole(id)
  if (response?.data) {
    return response
  }
  return {
    data: null,
    message: response?.response?.data?.message,
    TypeError: response?.response?.data?.typeError
  }
})
