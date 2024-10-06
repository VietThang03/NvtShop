import React from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import PaymentTypeListPage from 'src/views/pages/settings/payment-type/PaymentTypeList'

const PaymentTypePage = () => {
  return (
   <PaymentTypeListPage/>
  )
}

PaymentTypePage.permission = [PERMISSIONS.SETTING.PAYMENT_TYPE.VIEW]
export default PaymentTypePage
