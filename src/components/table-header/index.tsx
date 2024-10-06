import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../Icon'

type TProps = {
  numRow: number
  onClear: () => void
  actions: { label: string; value: string; disabled?: boolean }[]
  handleAction: (type: string) => void
}

const StyledTableHeader = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  border: `2px solid ${theme.palette.primary.main}`,
  padding: '4px 10px',
  width: '100%',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const TableHeader = (props: TProps) => {
  // ** Props
  const { numRow, onClear, actions, handleAction } = props

  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <StyledTableHeader>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography>Selected</Typography>
        <Typography
          sx={{
            backgroundColor: theme.palette.primary.main,
            height: '20px',
            width: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: theme.palette.customColors.lightPaperBg,
            fontWeight: 600,
            fontSize: '12px !important'
          }}
        >
          <span>{numRow}</span>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {actions?.map(action => {
          return (
            <Button
              disabled={action?.disabled}
              key={action.value}
              variant='contained'
              onClick={() => handleAction(action.value)}
            >
              {action.label}
            </Button>
          )
        })}
        <IconButton onClick={onClear}>
          <IconifyIcon icon='material-symbols-light:close' fontSize={'20px'} />
        </IconButton>
      </Box>
    </StyledTableHeader>
  )
}

export default TableHeader
