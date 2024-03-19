import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'

const Error500 = () => {
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
        Oops, something went wrong!
      </Typography>
    </Box>
  )
}

export default Error500
Error500.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
