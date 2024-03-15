import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import { NextPage } from 'next'
import VerticallLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import { useTheme } from '@mui/material'

type TProps = {
  children: React.ReactNode
}

const LayoutNoApp: NextPage<TProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HorizontalLayout open={false} toggleDrawer={() => {}} isHideMenu />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container
          sx={{
            m: 4,
            // backgroundColor: theme.palette.background.paper,
            width: 'calc(100vw - 32px)',
            maxWidth: 'unset !important',
            overflow: 'auto',
            maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight} - 32px )`,
            borderRadius: '15px',
            padding: 0
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default LayoutNoApp
