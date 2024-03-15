import { NextPage } from "next"
import { ReactNode } from "react"
import LayoutNoApp from "src/views/layouts/LayoutNoApp"
import MyProfilePage from "src/views/pages/my-porfile"

type TProps = {}

const MyProfile: NextPage<TProps> = () => {
    return <MyProfilePage/>
}

export default MyProfile
MyProfile.getLayout = (page: ReactNode) => <LayoutNoApp>{page}</LayoutNoApp>