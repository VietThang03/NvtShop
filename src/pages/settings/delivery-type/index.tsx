import React from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import DeliveryTypeListPage from 'src/views/pages/settings/delivery-type/DeliveryTypeList'

const DeliveryTypePage = () => {
  return (
   <DeliveryTypeListPage/>
  )
}

DeliveryTypePage.permission = [PERMISSIONS.SETTING.DELIVERY_TYPE.VIEW]
export default DeliveryTypePage
