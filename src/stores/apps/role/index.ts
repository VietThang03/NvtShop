// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createRolesAsync, deleteRolesAsync, getAllRolesAsync, updateRolesAsync } from './action'

const initialState = {
    isLoading: false,
    isSuccess: true,
    isError: false,
    message: '',
    typeError: '',
    roles:{
        data: [],
        total: 0
    },
    isSuccessCreateEdit: false,
    isErrorCreateEdit: false,
    messageCreateEdit: '',
    isSuccessDelete: false,
    isErrorDelete: false,
    messageDelete: '',
}

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    resetInitialState: (state) => {
      //ng dung dk r nhung van spam btn register
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageCreateEdit = ''
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.message = ''
    }
  },
  extraReducers: builder => {
    //get all role
    builder.addCase(getAllRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.roles.data = action.payload.data.roles
      state.roles.total = action.payload.data.totalCount
    })
    builder.addCase(getAllRolesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.roles.data = []
      state.roles.total = 0
    })

    //create role
    builder.addCase(createRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id // !! => chuyen code ve dang boolean
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(createRolesAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    //update role
    builder.addCase(updateRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id // !! => chuyen code ve dang boolean
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(updateRolesAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError
    })

    //update role
    builder.addCase(deleteRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id // !! => chuyen code ve dang boolean
      state.isErrorDelete = !action.payload?.data?._id
      state.messageDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(deleteRolesAsync.rejected, (state, action: any) => {
      state.isLoading = false
      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageDelete = action.payload?.message
      state.typeError = action.payload?.typeError
    })
  }
})

export const {resetInitialState} = roleSlice.actions
export default roleSlice.reducer
