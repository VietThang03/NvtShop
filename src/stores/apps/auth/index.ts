// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { changePasswordMe, register, updateAuthMe } from './actions'

const initialState = {
    isLoading: false,
    isSuccess: true,
    isError: false,
    message: '',
    typeError: '',
    isSuccessUpdateMe: true,
    isErrorUpdateMe: false,
    messageUpdateMe: '',
    isSuccessChangePassword: true,
    isErrorChangePassword: false,
    messageChangePassword: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetInitialState: (state) => {
      //ng dung dk r nhung van spam btn register
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
      state.isErrorUpdateMe = true
      state.isSuccessUpdateMe = false
      state.messageUpdateMe = ''
      state.isErrorChangePassword = true
      state.isSuccessChangePassword = false
      state.messageChangePassword = ''
    }
  },
  extraReducers: builder => {
    //register
    builder.addCase(register.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action.payload?.data?.email // !! ==> chuyen ve dang true (boolean)
      state.isError = !action.payload?.data?.email
      state.message = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
    })
    //update me
    builder.addCase(updateAuthMe.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateAuthMe.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessUpdateMe = !!action.payload?.data?.email // !! ==> chuyen ve dang true (boolean)
      state.isErrorUpdateMe = !action.payload?.data?.email
      state.messageUpdateMe = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(updateAuthMe.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = true
      state.messageUpdateMe = ''
      state.typeError = ''
    })
    
    //update me
    builder.addCase(changePasswordMe.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(changePasswordMe.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessChangePassword = !!action.payload?.data // !! ==> chuyen ve dang true (boolean)
      state.isErrorChangePassword = !action.payload?.data
      state.messageChangePassword = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(changePasswordMe.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccessChangePassword = false
      state.isErrorChangePassword = true
      state.messageChangePassword = ''
      state.typeError = ''
    })
  }
})

export const {resetInitialState} = authSlice.actions
export default authSlice.reducer
