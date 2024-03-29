import * as React from 'react'
import { styled, createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuIcon from '@mui/icons-material/Menu'
import { NextPage } from 'next'
import UserDropdown from 'src/views/layouts/components/user-dropdown'
import { ModeToggle } from './components/mode-toggle'
import { LanguageDropdown } from './components/language-dropdown'
import { useAuth } from 'src/hooks/useAuth'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'

type TProps = {
  open: boolean
  toggleDrawer: () => void
  isHideMenu?: boolean
}

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer, isHideMenu }) => {
  const { user } = useAuth()
  const router = useRouter()

  const handleNavigateLogin = () => {
    router.push(`/${ROUTE_CONFIG.LOGIN}`)
  }
  return (
    <AppBar position='absolute' open={open}>
      <Toolbar
        sx={{
          pr: '30px',
          padding: '0xp 20px' // keep right padding when drawer closed
        }}
      >
        {!isHideMenu && (
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' })
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography onClick={() => router.push('/')} component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1, cursor: 'pointer' }}>
          NvtShop
        </Typography>
        <LanguageDropdown />
        <ModeToggle />
        {user ? (
          <UserDropdown />
        ) : (
          <Button
            variant='contained'
            sx={{
              ml: 3,
              width: 'auto'
            }}
            onClick={handleNavigateLogin}
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default HorizontalLayout
