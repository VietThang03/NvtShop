/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable newline-before-return */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

// ** Types
import { buildAbilityFor, type ACLObj, type AppAbility } from 'src/configs/acl'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from '../acl/Can'
import BlankLayout from 'src/views/layouts/BlankLayout'
import Error401 from '../../pages/401'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props
  const auth = useAuth()
  const router = useRouter()
  const permissionUser = auth.user?.role?.permissions ?? []
  let ability: AppAbility
  if (auth.user && !ability) {
    ability = buildAbilityFor(permissionUser, aclAbilities.subject)
  }
  //if guest guard  or no guard is true or any error page
  if (guestGuard || router.route === '/500' || router.route === '/404' || !authGuard) {
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      return children
    }
  }

  //check the access off current user
  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return  <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }
  return (
    <BlankLayout>
      <Error401/>
    </BlankLayout>
  )
}

export default AclGuard
