import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import {
  TItemOrderProductMe,
  TParamsCreateOrderProduct,
  TParamsEditOrderProduct,
  TParamsGetOrderProducts,
  TParamsStatusOrderUpdate
} from 'src/types/order'

export const getAllOrderProductsByMe = async (data: { params: TParamsGetOrderProducts }) => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}/me`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const createOrderProduct = async (data: TParamsCreateOrderProduct) => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const updateStatusOrderProduct = async (data: TParamsStatusOrderUpdate) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.post(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}/status/${id}`, rests)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const getDetailOrderProductByMe = async (id: string) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}/me/${id}`)
        
        return res.data
    } catch (error) {
        return error
    }
}

export const cancelOrderProductOfMe = async (id: string) => {
    try {
      const res = await instanceAxios.post(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}/me/cancel/${id}`)
  
      return res.data
    } catch (error: any) {
      return error?.response?.data
    }
  }

//Admin cms

export const deleteOrderProduct = async (id: string) => {
    try {
      const res = await instanceAxios.delete(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}/${id}`)
  
      return res.data
    } catch (error: any) {
      return error?.response?.data
    }
  }
  
  export const getDetailsOrderProduct = async (id: string) => {
    try {
      const res = await instanceAxios.get(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}/${id}`)
  
      return res.data
    } catch (error: any) {
      return error?.response?.data
    }
  }

  export const getAllOrderProducts = async (data: { params: TParamsGetOrderProducts }) => {
    try {
      const res = await instanceAxios.get(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}`, data)
  
      return res.data
    } catch (error) {
      return error
    }
  }
  
  export const updateOrderProduct = async (data: TParamsEditOrderProduct) => {
    const { id, ...rests } = data
    try {
      const res = await instanceAxios.put(`${CONFIG_API.MANAGE_ORDER.ORDER.INDEX}/${id}`, rests)
  
      return res.data
    } catch (error: any) {
      return error?.response?.data
    }
  }

