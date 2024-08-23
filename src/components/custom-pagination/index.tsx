import { Box, MenuItem, Pagination, PaginationProps, Select, styled } from '@mui/material'
import React, { Ref } from 'react'
import { number } from 'yup'

type TProps = {
  page: number
  pageSize: number
  rowLength: number
  pageSizeOptions: number[]
  onChangePagination: (page: number, pageSize: number) => void
}

const StylePagination = styled(Pagination)<PaginationProps>(({theme}) => ({
}))

const CustomPagination = React.forwardRef((props: TProps, ref: Ref<any>) => {
  const { onChangePagination, page, pageSize, pageSizeOptions, rowLength, ...rests } = props
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: '8px'
      }}
    >
      <Box>
        <span>Dang hien thi {" "}</span>
        <span
          style={{
            fontWeight: 'bold'
          }}
        >
          {page === 1 ? page : 1 + pageSize}
          {' - '}
        </span>
        <span
          style={{
            fontWeight: 'bold'
          }}
        >
          {page * pageSize} {" "}
        </span>
        <span>{" "} tren {" "}</span>
        <span
          style={{
            fontWeight: 'bold'
          }}
        >
          {rowLength}
        </span>
      </Box>

      <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span>So dong hien thi</span>
          <Select sx={{
            '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall': {
                minWidth: "unset !important",
                padding: '8.5px 12px 8.5px 24px !important',
                marginRight: '20px'
            }
          }} size='small' value={pageSize} onChange={e => onChangePagination(1, +e.target.value)}>
            {pageSizeOptions.map(opt => {
                return (
                    <MenuItem key={opt} value={opt}>
                        {opt}
                    </MenuItem>
                )
            })}
          </Select>
        </Box>
        <StylePagination color='primary' {...rests}/>
      </Box>
    </Box>
  )
})
export default CustomPagination
