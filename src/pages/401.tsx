import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'

const Error401 = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh'
      }}
    >
      <Typography variant='h2' sx={{ mb: 1.5 }}>
        You are not authorized🥹
      </Typography>
    </Box>
  )
}

export default Error401
Error401.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
