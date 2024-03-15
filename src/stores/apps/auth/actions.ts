import { createAsyncThunk } from '@reduxjs/toolkit'
import instanceAxios from 'src/helpers/axios'
import { registerAuth } from 'src/services/auth'

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
