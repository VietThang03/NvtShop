import { CONFIG_API } from "src/configs/api";
import instanceAxios from "src/helpers/axios";
import { TCreateRole, TEditRole, TParamsGetRoles } from "src/types/role";

export const getAllRoles = async (data: {params: TParamsGetRoles}) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.ROLE.index}`, data)
        return res.data
    } catch (error: any) {
        return error?.response.data
    }
}

export const createRole = async (data: TCreateRole) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.ROLE.index}`, data)
        return res.data
    } catch (error) {
        return error
    }
}

export const updateRole = async (data: TEditRole) => {
    const {id, ...rests} = data
    try {
        const res = await instanceAxios.put(`${CONFIG_API.ROLE.index}/${id}`, rests)
        return res.data
    } catch (error) {
        return error
    }
}

export const deleteRole = async (id: string) => {
    try {
        const res = await instanceAxios.delete(`${CONFIG_API.ROLE.index}/${id}`)
        return res.data
    } catch (error) {
        return error
    }
}

export const getDetailRole = async (id: string) => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.ROLE.index}/${id}`)
        return res.data
    } catch (error) {
        return error
    }
}