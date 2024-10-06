import { PERMISSIONS } from 'src/configs/permission'
import UserListPage from 'src/views/pages/system/user/UserList'

const UserPage = () => {
  return (
    <>
      <UserListPage />
    </>
  )
}
UserPage.permissions = [PERMISSIONS.SYSTEM.USER.VIEW]
export default UserPage
