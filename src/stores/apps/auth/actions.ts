import { createAsyncThunk } from '@reduxjs/toolkit'
import instanceAxios from 'src/helpers/axios'
import { changePassword, registerAuth, updateAuth } from 'src/services/auth'
import { ChangePassword, RegisterAuth, UpdateAuth } from 'src/types/auth'

// ** Add User
export const register = createAsyncThunk('auth/register', async (data: RegisterAuth) => {
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
 
export const updateAuthMe = createAsyncThunk('auth/update-me', async(data: UpdateAuth) => {
    const response = await updateAuth(data)
    if(response?.data){
        return response
    }
    return {
        data: null,
        message: response?.response?.data?.message,
        TypeError: response?.response?.data?.typeError
   }  
})

export const changePasswordMe = createAsyncThunk('auth/change-password', async(data: ChangePassword) => {
    const response = await changePassword(data)
    console.log({response})
    if(response?.status==='Success'){
        return {...response, data: 1 }// data = true
    }
    return {
        data: null,
        message: response?.response?.data?.message,
        TypeError: response?.response?.data?.typeError
   }  
})
