import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA } from "src/configs/auth"

export const setLocalUserData = (userData: string, accessToken: string, resfreshToken: string) => {
    return {
        userData: window.localStorage.setItem(USER_DATA, userData),
        accessToken: window.localStorage.setItem(ACCESS_TOKEN, accessToken),
        resfreshToken: window.localStorage.setItem(REFRESH_TOKEN, resfreshToken)
    }
}

export const getLocalUserData = () => {
    return {
        userData: window.localStorage.getItem(USER_DATA),
        accessToken: window.localStorage.getItem(ACCESS_TOKEN),
        resfreshToken: window.localStorage.getItem(REFRESH_TOKEN)
    }
}

export const removeLocalUserData = () => {
       window.localStorage.removeItem(USER_DATA),
       window.localStorage.removeItem(ACCESS_TOKEN),
       window.localStorage.removeItem(REFRESH_TOKEN)
}