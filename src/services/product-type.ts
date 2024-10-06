import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import {
  TParamsCreateProductType,
  TParamsDeleteMultipleProductType,
  TParamsEditProductType,
  TParamsGetProductTypes
} from 'src/types/product-type'

export const getAllProductTypes = async (data: { params: TParamsGetProductTypes }) => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const createProductType = async (data: TParamsCreateProductType) => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}`, data)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const updateProductType = async (data: TParamsEditProductType) => {
  const { id, ...rests } = data
  try {
    const res = await instanceAxios.put(`${CONFIG_API.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}/${id}`, rests)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const deleteProductType = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${CONFIG_API.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}/${id}`)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const getDetailsProductType = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}/${id}`)

    return res.data
  } catch (error: any) {
    return error?.response?.data
  }
}

export const deleteMultipleProductType = async (data: TParamsDeleteMultipleProductType) => {
  try {
    const res = await instanceAxios.delete(`${CONFIG_API.MANAGE_PRODUCT.PRODUCT_TYPE.INDEX}/delete-many`, { data })
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