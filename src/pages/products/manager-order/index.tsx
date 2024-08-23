import React from 'react'
import { PERMISSIONS } from 'src/configs/permission'

const ManagerOrderPage = () => {
  return (
    <div>ManagerOrderPage</div>
  )
}

ManagerOrderPage.permissions = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]

export default ManagerOrderPage
