import axios from 'axios'
import { BASE_URL, CONFIG_API } from 'src/configs/api'
import { getLocalUserData, removeLocalUserData } from '../storage'
import { jwtDecode } from 'jwt-decode'
import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'

type TAxiosInterceptor = {
  children: React.ReactNode
}

const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
  if (router.asPath !== '/') {
    // neu route hien tai khac trang chu ==> doi ve tang login ==> login lai xong ==> redirect ve ngay tai trang do
    router.replace({
      pathname: '/login',
      query: { returnUrl: router.asPath }
    })
  } else {
    //neu route la trang chu ==> doi ve trang login
    router.replace('/login')
  }
  setUser(null)
  removeLocalUserData()
}

export  const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter()
  const {setUser} = useAuth()
  instanceAxios.interceptors.request.use(async config => {
    //gui request len api ==> di qua config
    //config chua headers ==> gui access_token len config de ko p cau hinh gui access_token cho moi request
    const { refreshToken, accessToken } = getLocalUserData()
    if (accessToken) {
      const decodedAccessToken = jwtDecode(accessToken)
      //check xem access token con han khong
      if (decodedAccessToken.exp! > Date.now() / 1000) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      } else {
        // neu access token het han ==> call api refresh toekn de lay access token moi cho vao headers
        if (refreshToken) {
          const decodedRefreshToken = jwtDecode(refreshToken)
          if (decodedRefreshToken.exp! > Date.now() / 1000) {
            //call api return new access token
            await axios.post(`${CONFIG_API.AUTH.index}/refresh-token`, {}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                }
            }).then((res) => {
                const newAccessToken = res?.data?.data?.access_token
                if(newAccessToken){
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`
                }else{
                    handleRedirectLogin(router, setUser)
                }
            }).catch(error => {
                handleRedirectLogin(router, setUser)
            })
          } else {
             //neu refreshToken het han  ==> chuyen ve trang login
            handleRedirectLogin(router, setUser)
          }
        } else {
            //neu refreshToken ko co  ==> chuyen ve trang login
            handleRedirectLogin(router, setUser)
        }
      } 
    } else {
        // neu khong co access token
        handleRedirectLogin(router, setUser)
    }
    return config
  })

  instanceAxios.interceptors.response.use(response => {
    //server tra ve api ==> di qua response
    return response
  })
  return <>{children}</>
}

const instanceAxios = axios.create({
  baseURL: BASE_URL
})

export default instanceAxios
