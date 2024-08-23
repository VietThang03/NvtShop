import { IconButton, Tooltip } from '@mui/material'
import IconifyIcon from '../Icon'

type TProps = {
  onClick: () => void
  disabled?: boolean 
}

const GridEdit = ({onClick, disabled}: TProps) => {
  return (
    <Tooltip title='Edit'>
      <IconButton onClick={onClick} disabled={disabled}>
        <IconifyIcon icon='material-symbols:edit-square-outline-rounded' />
      </IconButton>
    </Tooltip>
  )
}

export default GridEdit
