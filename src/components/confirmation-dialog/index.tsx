import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Typography, styled, useTheme } from '@mui/material';
import IconifyIcon from '../Icon';

interface TConfirmationDialog{
    handleClose: () => void
    open: boolean
    title: string
    description: string
    handleCancel: () => void
    handleConfirm: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomStylContent = styled(DialogContentText)(() => ({
    padding: "10px 20px"
}))

const StyledDialog = styled(Dialog)(() => ({
    "MuiPaper-root.MuiPaper-elevation":{
        width: '25rem'
    }
}))

const ConfirmationDialog = ({open, handleClose, title, description, handleCancel, handleConfirm}: TConfirmationDialog) => {

    const theme = useTheme()

  return (
    <React.Fragment>
      <StyledDialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{
            textAlign: 'center'
        }}>
            <Box sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center'
            }}>
                 <IconifyIcon icon="ep:warning" fontSize={50} color={theme.palette.warning.main} />
            </Box>
            <Typography variant='h4' sx={{fontWeight: 600}}>
                {title}
            </Typography>
        </DialogTitle>
        <CustomStylContent>  
          <DialogContentText sx={{
            textAlign: 'center',
            marginBottom: "20px"
          }}>
            {description}
          </DialogContentText>
        </CustomStylContent>
        <DialogActions>
          <Button variant='contained' onClick={handleConfirm}>Yes</Button>
          <Button color='error' variant='outlined' onClick={handleCancel}>No</Button>
        </DialogActions>
      </StyledDialog>
    </React.Fragment>
  );
}

export default ConfirmationDialog
