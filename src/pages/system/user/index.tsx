import { PERMISSIONS } from "src/configs/permission"

const UserPage = () => {
  return(
      <>
      <h1>User Page</h1>
      </>
  )
}
UserPage.permissions = [PERMISSIONS.SYSTEM.USER.VIEW]
export default UserPage