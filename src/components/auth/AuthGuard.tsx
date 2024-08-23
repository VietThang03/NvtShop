/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode, ReactElement, useEffect } from 'react'
import { ACCESS_TOKEN, USER_DATA } from 'src/configs/auth'
import { getTemporaryToken, removeLocalUserData, removeTemporaryToken } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const authContext = useAuth()
  const router = useRouter()
  useEffect(() => {
    const {temporaryToken} = getTemporaryToken()
    //kt xem page truy cap first render chua, neu chua ko cho chay code duoi
    if(!router.isReady){
      return
    }
    if(authContext.user === null && !window.localStorage.getItem(ACCESS_TOKEN) && !window.localStorage.getItem(USER_DATA) && !temporaryToken){
      if(router.asPath !== '/' && router.asPath !== 'login'){
        router.replace({
          pathname: '/login',
          query:{
            returnUrl: router.asPath
          }
        })
      }else{
         router.replace('/login')
      }  
      authContext.setUser(null)
      removeLocalUserData()
    }
  }, [router.route])

  useEffect(() => {
    const handleUnload = () => {
      removeTemporaryToken()
    }  
    return () => {
      window.addEventListener("beforeunload", handleUnload)
    }
  },[])
  
  if(authContext.user === null || authContext.loading){
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
