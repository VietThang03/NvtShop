// ** React Imports

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'

const Error404 = () => {
  return (
    <Box className='content-center' sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh'
    }}>
      <Typography variant='h2' sx={{ mb: 1.5 }}>
        Page Not Found😓
      </Typography>
    </Box>
  )
}

export default Error404
Error404.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>