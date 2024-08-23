import CustomDataGrid from 'src/components/custom-data-grid'
import { LIST_DATA_PERMISSIONS, PERMISSIONS } from 'src/configs/permission'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Button, Checkbox, Typography, useTheme } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import FallbackSpinner from 'src/components/fall-back'
import { getAllValueOfObject } from 'src/utils'

interface Props {
  permissonSelected: string[]
  setPermissionSelected: Dispatch<SetStateAction<string[]>>
  disablePermission: boolean
}

const TablePermission = ({ permissonSelected, setPermissionSelected, disablePermission }: Props) => {
  const theme = useTheme()
  const [loading, setLoading] = useState<boolean>(false)
  const getValuePermission = (value: string, mode: string, parentValue?: string) => {
    try {
      return parentValue ? PERMISSIONS[parentValue][value][mode] : PERMISSIONS[value]
    } catch (error) {
      return ''
    }
  }

  const handleIsChecked = (value: string, parentValue?: string) => {
    const allValue = parentValue
      ? getAllValueOfObject(PERMISSIONS[parentValue][value])
      : getAllValueOfObject(PERMISSIONS[value])
    //kiem tra xem allValue co chua tat ca gia tri trung voi permissonSelected ko
    const isCheckedAll = allValue.every(item => permissonSelected.includes(item))
    return {
      isCheckedAll,
      allValue
    }
  }

  const handleCheckAllCheckbox = (value: string, parentValue?: string) => {
    const { isCheckedAll, allValue } = handleIsChecked(value, parentValue)
    if (isCheckedAll) {
      //neu gia tri allValue trung voi permissonSelected ==> loai bo cac item trung nhau o permissonSelected (tra ve gia tri khong trung voi allValue)
      const filter = permissonSelected.filter(item => !allValue.includes(item))
      setPermissionSelected(filter)
    } else {
      setPermissionSelected([...new Set([...permissonSelected, ...allValue])])
    }
  }

  const handleOnchangeCheckbox = (value: string) => {
    const isChecked = permissonSelected.includes(value)
    if (isChecked) {
      const filtered = permissonSelected.filter(item => item != value)
      setPermissionSelected(filtered)
    } else {
      //tranh truong hop mang bi duplicate item
      setPermissionSelected([...permissonSelected, value])
    }
  }

  const handleCheckAllGroupCheckbox = (value: string) => {
    const { isCheckedAll, allValue } = handleIsChecked(value)
    if (isCheckedAll) {
      //neu gia tri allValue trung voi permissonSelected ==> loai bo cac item trung nhau o permissonSelected (tra ve gia tri khong trung voi allValue)
      const filter = permissonSelected.filter(item => !allValue.includes(item))
      setPermissionSelected(filter)
    } else {
      setPermissionSelected([...new Set([...permissonSelected, ...allValue])])
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'all',
      headerName: '',
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const { isCheckedAll, allValue } = handleIsChecked(row.value, row.parentValue)
        return (
          <>
            {' '}
            {!row?.isHideAll && (
              <Checkbox
                disabled={disablePermission}
                checked={isCheckedAll}
                value={row?.value}
                onChange={e => {
                  if (row.isParent) {
                    handleCheckAllGroupCheckbox(e.target.value)
                  } else {
                    handleCheckAllCheckbox(e.target.value, row.parentValue)
                  }
                }}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        return (
          <>
            <Typography
              sx={{
                color: row?.isParent ? theme.palette.primary.main : `rgba(${theme.palette.customColors.main}, 0.78s)`,
                paddingLeft: row?.isParent ? '0' : '20px',
                textTransform: row?.isParent ? 'uppercase' : 'normal'
              }}
            >
              {row?.name}
            </Typography>
          </>
        )
      }
    },
    {
      field: 'view',
      headerName: 'View',
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = getValuePermission(row.value, 'VIEW', row.parentValue)
        return (
          <>
            {!row?.isHideView && !row?.isParent && (
              <Checkbox
                value={value}
                onChange={e => handleOnchangeCheckbox(e.target.value)}
                checked={permissonSelected.includes(value)}
                disabled={disablePermission}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'create',
      headerName: 'Create',
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = getValuePermission(row.value, 'CREATE', row.parentValue)
        return (
          <>
            {!row?.isHideCreate && !row?.isParent && (
              <Checkbox
                value={value}
                onChange={e => handleOnchangeCheckbox(e.target.value)}
                checked={permissonSelected.includes(value)}
                disabled={disablePermission}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'update',
      headerName: 'Update',
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = getValuePermission(row.value, 'UPDATE', row.parentValue)
        return (
          <>
            {!row?.isHideUpdate && !row?.isParent && (
              <Checkbox
                value={value}
                onChange={e => handleOnchangeCheckbox(e.target.value)}
                checked={permissonSelected.includes(value)}
                disabled={disablePermission}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'delete',
      headerName: 'Delete',
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = getValuePermission(row.value, 'DELETE', row.parentValue)
        return (
          <>
            {!row?.isHideDelete && !row?.isParent && (
              <Checkbox
                value={value}
                onChange={e => handleOnchangeCheckbox(e.target.value)}
                checked={permissonSelected.includes(value)}
                disabled={disablePermission}
              />
            )}
          </>
        )
      }
    }
  ]
  return (
    <>
      {loading && <FallbackSpinner />}
      <CustomDataGrid
        rows={LIST_DATA_PERMISSIONS}
        columns={columns}
        autoHeight
        hideFooter
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
      />
    </>
  )
}

export default TablePermission
