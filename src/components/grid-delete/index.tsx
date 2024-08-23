import { IconButton, Tooltip } from '@mui/material'
import IconifyIcon from '../Icon'

type TProps = {
  onClick: () => void
  disabled?: boolean 
}

const GridDelete = ({onClick, disabled}: TProps) => {
  return (
    <Tooltip title='Delete'>
      <IconButton onClick={onClick} disabled={disabled}>
        <IconifyIcon icon='material-symbols:delete-outline-rounded' />
      </IconButton>
    </Tooltip>
  )
}

export default GridDelete
