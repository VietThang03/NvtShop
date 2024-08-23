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

const UserLayout: NextPage<TProps> = ({ children }) => {
  const theme = useTheme()
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <VerticallLayout open={open} toggleDrawer={toggleDrawer} />
      <HorizontalLayout open={open} toggleDrawer={toggleDrawer} />
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
            mt: 4,
            mb: 4,
            width: `calc(100% - 32px)`,
            maxWidth: 'unset !important',
            overflow: 'auto',
            maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight} - 32px )`,
            height: `calc(100vh - ${theme.mixins.toolbar.minHeight} - 32px )`,
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

export default UserLayout
