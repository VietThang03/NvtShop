import { CONFIG_API } from "src/configs/api";
import instanceAxios from "src/helpers/axios";
import { TCreateUser, TEditUser, TParamsDeleteMultipleUser, TParamsGetUsers } from "src/types/user";

export const getAllUsers = async (data: {params: TParamsGetUsers}) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.USER.index}`, data)
        return res?.data
    } catch (error) {
        return error
    }
}

export const createUser = async (data: TCreateUser) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.USER.index}`, data)
        return res?.data
    } catch (error: any) {
        return error?.response?.data
    }
}

export const updateUser = async(data: TEditUser) => {
    try {
        const {id, ...rests} = data
        const res = await instanceAxios.put(`${CONFIG_API.USER.index}/${id}`, rests)
        return res.data
    } catch (error: any) {
      return error?.response?.data
    }
}

export const deleteUser = async (id: string) => {
    try {
      const res = await instanceAxios.delete(`${CONFIG_API.USER.index}/${id}`)
  
      return res.data
    } catch (error: any) {
      return error?.response?.data
    }
  }

  export const getDetailsUser = async (id: string) => {
    try {
      const res = await instanceAxios.get(`${CONFIG_API.USER.index}/${id}`)
  
      return res.data
    } catch (error: any) {
      return error?.response?.data
    }
  }

  export const deleteMultipleUser = async (data: TParamsDeleteMultipleUser) => {
    try {
      const res = await instanceAxios.delete(`${CONFIG_API.USER.index}/delete-many`, { data })
      if (res?.data?.status === 'Success') {
        return {
          data: []
        }
      }
  
      return {
        data: null
      }
    } catch (error: any) {
      return error?.response?.data
    }
  }
  