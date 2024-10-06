// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
//import user from 'src/stores/apps/user'
import auth from 'src/stores/apps/auth'
import role from 'src/stores/apps/role'
import user from 'src/stores/apps/users'
import orderProduct from 'src/stores/apps/order-product'
import paymentType from 'src/stores/apps/payment-type'
import city from 'src/stores/apps/city'
import deliveryType from 'src/stores/apps/delivery-type'
import product from 'src/stores/apps/product'
import productType from 'src/stores/apps/product-type'

export const store = configureStore({
  reducer: {
    //user,
    auth,
    role,
    user,
    city,
    paymentType,
    orderProduct,
    deliveryType,
    product,
    productType
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
