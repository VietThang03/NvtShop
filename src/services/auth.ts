import axios from "axios"
import { CONFIG_API } from "src/configs/api"
import { LoginAuth } from "src/types/auth"

export const loginAuth = async (data: LoginAuth) => {
    try {
        const res = await axios.post(CONFIG_API.AUTH.index, data)
        return res.data
    } catch (error) {
        console.log(error)
    }
}