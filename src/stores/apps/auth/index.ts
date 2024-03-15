// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { register } from './actions'

const initialState = {
    isLoading: false,
    isSuccess: true,
    isError: false,
    message: '',
    typeError: ''
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
    }
  },
  extraReducers: builder => {
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
  }
})

export const {resetInitialState} = authSlice.actions
export default authSlice.reducer
