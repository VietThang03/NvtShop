import React from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import RoleListPage from 'src/views/pages/system/role/RoleList'

const RolePage = () => {
  return <RoleListPage />
}

RolePage.permissions = [PERMISSIONS.SYSTEM.ROLE.VIEW]

export default RolePage
