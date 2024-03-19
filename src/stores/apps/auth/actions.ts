import { createAsyncThunk } from '@reduxjs/toolkit'
import instanceAxios from 'src/helpers/axios'
import { registerAuth, updateAuth } from 'src/services/auth'

// ** Add User
export const register = createAsyncThunk('auth/register', async (data: any) => {
    const response = await registerAuth(data)
    if(response?.data){
        return response
    }
    return {
        data: null,
        message: response?.response?.data?.message,
        TypeError: response?.response?.data?.typeError
   }  
})

export const updateAuthMe = createAsyncThunk('auth/update-me', async(data: any) => {
    const response = await updateAuth(data)
    console.log(response)
    if(response?.data){
        return response
    }
    return {
        data: null,
        message: response?.response?.data?.message,
        TypeError: response?.response?.data?.typeError
   }  
})
