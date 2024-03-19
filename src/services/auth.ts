import axios from "axios"
import { CONFIG_API } from "src/configs/api"
import instanceAxios from "src/helpers/axios"
import { LoginAuth, RegisterAuth, UpdateAuth } from "src/types/auth"

export const loginAuth = async (data: LoginAuth) => {
        const res = await axios.post(`${CONFIG_API.AUTH.index}/login`, data)
        return res.data
}

export const logoutAuth = async () => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.AUTH.index}/logout`)
        return res.data
    } catch (error) {
        return error;
    }
}

export const registerAuth = async (data: RegisterAuth) => {
    try {
        const res = await axios.post(`${CONFIG_API.AUTH.index}/register`, data)
        return res.data
    } catch (error) {
       return error;
    }
}

export const updateAuth = async (data: UpdateAuth) => {
    try {
        const res = await instanceAxios.put(`${CONFIG_API.AUTH.index}/me`, data)
        return res.data
    } catch (error) {
        return error
    }
}

export const getAuthMe = async() => {
    try {
        const res = await instanceAxios.get(`${CONFIG_API.AUTH.AUTHME}`)
        return res.data
    } catch (error) {
        return error
    }
}