import { Box, Button, Modal, ModalProps, Typography, styled } from '@mui/material'
import React from 'react'

interface TCustomModal extends ModalProps {
  handleClose: () => void
}

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => ({
  zIndex: 1300
}))

const CustomModal = ({ children, handleClose, open }: TCustomModal) => {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  return (
    <>
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            height: '100%',
            width: '100vw',
            overflow: 'auto'
          }}
        >
          <Box
            sx={{
              maxHeight: '100vh',
              overflow: 'auto'
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'              
              }}
            >
              <Box sx={{margin: '40px 0'}}>{children}</Box>
            </Box>
          </Box>
        </Box>
      </StyledModal>
    </>
  )
}

export default CustomModal
