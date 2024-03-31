import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import { styled } from '@mui/material'

const StyleCustomDataGrid = styled(DataGrid)<DataGridProps>(({theme}) => ({
    "& .MuiDataGrid-main": {
        border: `1px solid ${theme.palette.customColors.borderColor}`,
        borderRadius: '8px'
    }
}))

const CustomDataGrid = React.forwardRef((props: DataGridProps, ref: React.Ref<any>) => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <StyleCustomDataGrid
        {...props}
      />
    </Box>
  )
})

export default CustomDataGrid
