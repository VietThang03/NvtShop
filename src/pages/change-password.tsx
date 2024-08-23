import { ReactNode } from "react"
import LayoutNoApp from "src/views/layouts/LayoutNoApp"
import ChangePasswordPage from "src/views/pages/change-password"

const ChangePassword = () => {
    return <ChangePasswordPage/>
}

export default ChangePassword
ChangePassword.getLayout = (page: ReactNode) => <LayoutNoApp>{page}</LayoutNoApp>