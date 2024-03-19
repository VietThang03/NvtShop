/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Modal, ModalProps } from '@mui/material'
import CircularWithValueLabel from '../circular-process'

const CustomModal = styled(Modal)<ModalProps>(({theme}) => ({
  "&.MuiModal-root": {
    width: '100%',
    height: '100%',
    zIndex: 2000,
    ".MuiModal-backdrop": {
      backgroundColor: `rgba(${theme.palette.customColors.main}, 0.7)`
    }
  }
}))

const ModalSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <CustomModal open={true}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <CircularWithValueLabel />
    </CustomModal>
  )
}

export default ModalSpinner
