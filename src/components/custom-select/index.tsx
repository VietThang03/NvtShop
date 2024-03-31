import { Box, InputLabel, InputLabelProps, MenuItem, MenuItemProps, Select, SelectProps, styled } from '@mui/material'

interface TCustomSelect extends SelectProps {
  options: { label: string; value: string }[]
}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input': {
    padding: '8px 8px 8px 10px !important',
    height: '34px',
    boxSizing: 'border-box'
  },
  "legend": {
    display: "none"
  },
  'svg':{
   top: "calc(50% - .6em)"
  }
}))

const CustomPlaceholder = styled(InputLabel)<InputLabelProps>(({theme}) => ({
      position: 'absolute',
      top: '5px',
      left: '10px',
      color: `rgba(${theme.palette.customColors.main}, 0.42)`
}))

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({}))

const CustomSelect = (props: TCustomSelect) => {
  const { value, label, onChange, options, fullWidth, placeholder,...rest } = props

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      {(Array.isArray(value) && !value.length) || !value && (
          <CustomPlaceholder>{placeholder}</CustomPlaceholder>
      )}
      <StyledSelect
        fullWidth={fullWidth}
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={value}
        label='Age'
        onChange={onChange}
        {...rest}
      >
        {options?.length > 0 ? (
          options?.map(opt => (
            <StyledMenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </StyledMenuItem>
          ))
        ) : (
          <StyledMenuItem>No data</StyledMenuItem>
        )}
      </StyledSelect>
    </Box>
  )
}

export default CustomSelect
