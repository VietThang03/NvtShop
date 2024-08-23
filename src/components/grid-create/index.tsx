import { IconButton, Tooltip, useTheme } from '@mui/material'
import IconifyIcon from '../Icon'

type TProps = {
  onClick: () => void
  disabled?: boolean
}

const GridCreate = ({ onClick, disabled }: TProps) => {
  const theme = useTheme()
  return (
    <Tooltip title='Create'>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: `${theme.palette.common.white}`
        }}
      >
        <IconifyIcon icon='ic:round-plus' />
      </IconButton>
    </Tooltip>
  )
}

export default GridCreate
