import React from 'react'
import { PERMISSIONS } from 'src/configs/permission'
import CityListPage from 'src/views/pages/settings/city/CityList'

const CityPage = () => {
  return (
    <div><CityListPage/></div>
  )
}

CityPage.permissions = [PERMISSIONS.SETTING.CITY.VIEW]

export default CityPage
