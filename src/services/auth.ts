import axios from "axios"
import { CONFIG_API } from "src/configs/api"
import instanceAxios from "src/helpers/axios"
import { LoginAuth } from "src/types/auth"

export const loginAuth = async (data: LoginAuth) => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.AUTH.index}/login`, data)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const logoutAuth = async () => {
    try {
        const res = await instanceAxios.post(`${CONFIG_API.AUTH.index}/logout`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}