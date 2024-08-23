import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps } from '@mui/x-data-grid'
import { styled } from '@mui/material'

const StyleCustomDataGrid = styled(DataGrid)<DataGridProps>(({theme}) => ({
    "& .MuiDataGrid-withBorderColor": {
        outline: "none !important"
    },
    ".MuiDataGrid-selectedRowCount":{
      dispaly: "none"
    },
    ".MuiDataGrid-virtualScroller.css-qvtrhg-MuiDataGrid-virtualScroller":{
      position: 'static'
    }
}))

const CustomDataGrid = React.forwardRef((props: DataGridProps, ref: React.Ref<any>) => {
  return (
    <Box sx={{ height: 400, width: '100%', overflow: "auto" }}>
      <StyleCustomDataGrid
        {...props}
      />
    </Box>
  )
})

export default CustomDataGrid
