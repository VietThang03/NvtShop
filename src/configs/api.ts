export const BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL

export const CONFIG_API = {
    AUTH: {
        index: `${BASE_URL}/auth`,
        AUTHME: `${BASE_URL}/auth/me`
    },
    ROLE: {
        index: `${BASE_URL}/roles`,
        AUTHME: `${BASE_URL}/auth/me`
    }
}