import { Box, Button, Grid, IconButton, Tooltip, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomDataGrid from 'src/components/custom-data-grid'
import { AppDispatch, RootState } from 'src/stores'
import { deleteRolesAsync, getAllRolesAsync, updateRolesAsync } from 'src/stores/apps/role/action'
import { GridColDef, GridRowClassNameParams, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import IconifyIcon from 'src/components/Icon'
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './CreateEditRole'
import FallbackSpinner from 'src/components/fall-back'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/apps/role'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import TablePermission from './components/TablePermission'
import { getDetailRole } from 'src/services/role'
import { PERMISSIONS } from 'src/configs/permission'
import { getAllValueOfObject } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermission } from 'src/hooks/usePermission'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/error'

const RoleListPage = () => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      width: 150,
      align: 'left',
      renderCell: params => {
        const { row } = params
        return (
          <Box>        
              <>
                <GridEdit
                  disabled={!UPDATE}
                  onClick={() =>
                    setOpenCreateEdit({
                      open: true,
                      id: String(row._id)
                    })
                  }
                />
                <GridDelete
                  disabled={!DELETE}
                  onClick={() =>
                    setOpenDeleteRole({
                      open: true,
                      id: String(row._id)
                    })
                  }
                />
              </>
          </Box>
        )
      }
    }
  ]
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteRole, setOpenDeleteRole] = useState({
    open: false,
    id: ''
  })
  const [sortBy, setSortBy] = useState<string>('created asc')
  const [searchBy, setSearchBy] = useState<string>('')
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<{ id: string; name: string }>({
    id: '',
    name: 'string'
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [disablePermission, setDisablePermission] = useState<boolean>(false)
  //permission
  const { CREATE, DELETE, UPDATE, VIEW } = usePermission('SYSTEM.ROLE', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])
  const theme = useTheme()
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch: AppDispatch = useDispatch()
  const {
    roles,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageCreateEdit,
    isLoading,
    isSuccessDelete,
    isErrorDelete,
    messageDelete,
    typeError
  } = useSelector((state: RootState) => state.role)

  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  const handleCloseConfirmDeleteRole = () => {
    setOpenDeleteRole({
      open: false,
      id: ''
    })
  }

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`)
  }

  // const PaginationComponent = () => {
  //   return (
  //     <CustomPagination
  //       pageSize={pageSize}
  //       page={page}
  //       rowLength={roles.total}
  //       pageSizeOptions={PAGE_SIZE_OPTION}
  //       onChangePagination={handleOnChangePagination}
  //     />
  //   )
  // }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleDeleteRole = () => {
    dispatch(deleteRolesAsync(openDeleteRole.id))
  }

  useEffect(() => {
    handleGetListRoles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success('Create role successfully')
      } else {
        toast.success('Update role successfully')
      }
      handleGetListRoles()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if(errorConfig){
        toast.error(messageCreateEdit)
      }else{
        if(openCreateEdit.id){
          toast.error('Update role failed')
        }else{
          toast.error('Create role failed')
        }
      }    
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageCreateEdit])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success('Delete role successfully')
      handleGetListRoles()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteRole()
    } else if (isErrorDelete && messageDelete) {
      toast.error(messageDelete)
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageDelete])

  const handleGetDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailRole(id)
      .then(res => {
        if (res?.data) {
          if (res?.data.permissions.includes(PERMISSIONS.ADMIN)) {
            setDisablePermission(true)
            setPermissionSelected(getAllValueOfObject(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC]))
          } else if (res?.data.permissions.includes(PERMISSIONS.BASIC)) {
            setDisablePermission(true)
            setPermissionSelected((PERMISSIONS as any).DASHBOARD)
          } else {
            setDisablePermission(false)
            setPermissionSelected(res?.data?.permissions || [])
          }
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const handleUpdateRole = () => {
    dispatch(updateRolesAsync({ name: selectedRow.name, id: selectedRow.id, permissions: permissionSelected }))
  }

  useEffect(() => {
    if (selectedRow.id) {
      handleGetDetailsRole(selectedRow.id)
    }
  }, [selectedRow])

  return (
    <>
      <ConfirmationDialog
        title='Xóa nhóm vai trò'
        open={openDeleteRole.open}
        handleClose={handleCloseConfirmDeleteRole}
        handleCancel={handleCloseConfirmDeleteRole}
        handleConfirm={handleDeleteRole}
        description='Việc xác nhận sẽ xóa vĩnh viễn vai trò này, bạn nên cân nhắc trước khi xác nhận!!!'
      />
      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} idRole={openCreateEdit.id} />
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%',
          width: '100%',
          borderRadius: '15px'
        }}
      >
        <Grid container sx={{ width: '100%', height: '100%' }}>
          <Grid item md={4} xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 4
              }}
            >
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
              </Box>
              <GridCreate
                disabled={!CREATE}
                onClick={() => {
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }}
              />
            </Box>
            <Box
              sx={{
                maxHeight: '100%'
              }}
            >
              <CustomDataGrid
                sx={{
                  '.row-selected': {
                    backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`,
                    color: `${theme.palette.primary.main} !important`
                  }
                }}
                rows={roles.data}
                columns={columns}
                pageSizeOptions={[5]}
                checkboxSelection
                autoHeight
                //hideFooter
                sortingOrder={['desc', 'asc']}
                sortingMode='server'
                onSortModelChange={handleSort}
                getRowId={row => row._id}
                disableRowSelectionOnClick
                // slots={{
                //   pagination: PaginationComponent
                // }}
                disableColumnMenu
                disableColumnFilter
                onRowClick={row => {
                  setSelectedRow({
                    id: row.id as string,
                    name: row?.row?.name
                  })
                  setOpenCreateEdit({
                    open: false,
                    id: row.id as string
                  })
                  //console.log(row)
                }}
                getRowClassName={(row: GridRowClassNameParams) => {
                  return row.id === selectedRow.id ? 'row-selected' : ''
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            md={8}
            xs={12}
            sx={{ maxHeight: '100%' }}
            paddingLeft={{ md: '40px', xs: '0' }}
            paddingTop={{ md: '0px', xs: '20px' }}
          >
            {selectedRow.id && (
              <>
                <Box
                  sx={{
                    height: 'calc(100% -40px)'
                  }}
                >
                  <TablePermission
                    permissonSelected={permissionSelected}
                    setPermissionSelected={setPermissionSelected}
                    disablePermission={disablePermission}
                  />
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    disabled={disablePermission}
                    type='submit'
                    variant='contained'
                    sx={{ mt: 3 }}
                    onClick={handleUpdateRole}
                  >
                    Update
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default RoleListPage
