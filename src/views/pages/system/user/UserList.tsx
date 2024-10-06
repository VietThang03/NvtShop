import {
  Box,
  Button,
  Card,
  Chip,
  ChipProps,
  Grid,
  IconButton,
  styled,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomDataGrid from 'src/components/custom-data-grid'
import { AppDispatch, RootState } from 'src/stores'
import { deleteRolesAsync } from 'src/stores/apps/role/action'
import {
  GridColDef,
  GridRowClassNameParams,
  GridRowSelectionModel,
  GridSortModel,
  GridValueGetterParams
} from '@mui/x-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import FallbackSpinner from 'src/components/fall-back'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/apps/role'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { PERMISSIONS } from 'src/configs/permission'
import { getAllValueOfObject, toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermission } from 'src/hooks/usePermission'
import CreateEditUser from './components/CreateEditUser'
import { deleteMultipleUserAsync, getAllUserAsync } from 'src/stores/apps/users/action'
import TableHeader from 'src/components/table-header'
import { OBJECT_TYPE_ERROR_USER } from 'src/configs/error'

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

const ActiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#28c76f29',
  color: '#3a843f',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const DeactivateUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#da251d29',
  color: '#da251d',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const UserListPage = () => {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleUser, setOpenDeleteMultipleUser] = useState(false)
  const [sortBy, setSortBy] = useState<string>('created desc')
  const [searchBy, setSearchBy] = useState<string>('')
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<TSelectedRow[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [disablePermission, setDisablePermission] = useState<boolean>(false)
  //permission
  const { CREATE, DELETE, UPDATE, VIEW } = usePermission('SYSTEM.USER', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])
  const theme = useTheme()
  const router = useRouter()
  const dispatch: AppDispatch = useDispatch()
  const {
    users,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError,
    isErrorMultipleDelete,
    isSuccessMultipleDelete,
    messageErrorMultipleDelete
  } = useSelector((state: RootState) => state.user)

  //column users
  const columns: GridColDef[] = [
    {
      field: i18n.language === 'vi' ? 'lastName' : 'firstName',
      headerName: 'Fullname',
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params
        const fullName = toFullName(row?.lastName || '', row?.middleName || '', row?.firstName || '', i18n.language)

        return <Typography>{fullName}</Typography>
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.email}</Typography>
      }
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone number',
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.phoneNumber}</Typography>
      }
    },
    {
      field: 'city',
      headerName: 'City',
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.city?.name}</Typography>
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return <>{row.status ? <ActiveUserStyled label='Active' /> : <DeactivateUserStyled label='Blocking' />}</>
      }
    },
    {
      field: 'userType',
      headerName: 'User Type',
      minWidth: 120,
      maxWidth: 120,
      renderCell: params => {
        const { row } = params

        return (
          <>
            {row.userType && (
              <Box>
                {/* <Icon icon={(mapUserType as any)[row.userType]?.icon} fontSize={(mapUserType as any)[row.userType]?.iconSize || 24} /> */}
                UserType
              </Box>
            )}
          </>
        )
      }
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
                    id: String(params.id)
                  })
                }
              />
              <GridDelete
                disabled={!DELETE}
                onClick={() =>
                  setOpenDeleteUser({
                    open: true,
                    id: String(params.id)
                  })
                }
              />
            </>
          </Box>
        )
      }
    }
  ]

  const memoDisableDeleteUser = useMemo(() => {
    return selectedRow.some((item: TSelectedRow) => item?.role?.permissions?.includes(PERMISSIONS.ADMIN))
  }, [selectedRow])

  const handleGetListUser = () => {
    dispatch(getAllUserAsync({ params: { limit: pageSize, page: page, search: searchBy, order: sortBy } }))
  }

  const handleCloseConfirmDeleteUser = () => {
    setOpenDeleteUser({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleUser = useCallback(() => {
    setOpenDeleteMultipleUser(false)
  }, [])

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('created desc')
    }
  }

  const handleOnChangePagination = (page: number, pageSize: number): void => {
    setPageSize(pageSize)
    setPage(page)
  }

  const PaginationComponent = () => {
    return (
      <CustomPagination
        pageSize={pageSize}
        page={page}
        rowLength={users.total}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleOnChangePagination}
      />
    )
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleDeleteUser = () => {
    dispatch(deleteRolesAsync(openDeleteUser.id))
  }

  const handleDeleteMultipleUser = () => {
    dispatch(
      deleteMultipleUserAsync({
        userIds: selectedRow?.map((item: TSelectedRow) => item.id)
      })
    )
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenDeleteMultipleUser(true)
        break
      }
    }
  }

  useEffect(() => {
    handleGetListUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_user_success'))
      } else {
        toast.success(t('Update_user_success'))
      }
      handleGetListUser()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_USER[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_user_error'))
        } else {
          toast.error(t('Create_user_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_user_success'))
      handleGetListUser()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteUser()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_user_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  useEffect(() => {
    if(isSuccessMultipleDelete){
      toast.success(t('Delete_multiple_user_success'))
      handleGetListUser()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteUser()
      setSelectedRow([])
    }else if(isErrorMultipleDelete && messageErrorMultipleDelete){
      toast.error(t('Delete_multiple_user_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isErrorMultipleDelete, isSuccessMultipleDelete, messageErrorMultipleDelete])

  return (
    <>
      {loading && <FallbackSpinner />}
      <ConfirmationDialog
        title='Xóa nhóm người dùng'
        open={openDeleteUser.open}
        handleClose={handleCloseConfirmDeleteUser}
        handleCancel={handleCloseConfirmDeleteUser}
        handleConfirm={handleDeleteUser}
        description='Việc xác nhận sẽ xóa vĩnh viễn người dùng này, bạn nên cân nhắc trước khi xác nhận!!!'
      />
      <ConfirmationDialog
        title='Xóa nhóm người dùng'
        open={openDeleteMultipleUser}
        handleClose={handleCloseConfirmDeleteMultipleUser}
        handleCancel={handleCloseConfirmDeleteMultipleUser}
        handleConfirm={handleDeleteMultipleUser}
        description='Việc xác nhận sẽ xóa vĩnh viễn những người dùng đã được chọn, bạn nên cân nhắc trước khi xác nhận!!!'
      />
      <CreateEditUser open={openCreateEdit.open} onClose={handleCloseCreateEdit} idUser={openCreateEdit.id} />
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
          {!selectedRow.length && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                mb: 4,
                gap: 4,
                width: '100%'
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
          )}

          {selectedRow.length > 0 && (
            <TableHeader
              numRow={selectedRow.length}
              onClear={() => setSelectedRow([])}
              actions={[{ label: 'Delete', value: 'delete', disabled: memoDisableDeleteUser || !DELETE }]}
              handleAction={handleAction}
            />
          )}

          <CustomDataGrid
            rows={users.data}
            columns={columns}
            autoHeight
            sx={{
              '.row-selected': {
                backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`,
                color: `${theme.palette.primary.main} !important`
              }
            }}
            checkboxSelection
            sortingOrder={['desc', 'asc']}
            sortingMode='server'
            onSortModelChange={handleSort}
            getRowId={row => row._id}
            disableRowSelectionOnClick
            slots={{
              pagination: PaginationComponent
            }}
            //sau khi click clear o btn clear thi xoa het checkbox da chon o CustomDataGrid
            rowSelectionModel={selectedRow?.map(item => item.id)}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              const formatData: any = row.map(id => {
                const findRow: any = users?.data?.find((item: any) => item._id === id)
                if (findRow) {
                  return { id: findRow?._id, role: findRow?.role }
                }
              })
              setSelectedRow(formatData)
            }}
            disableColumnFilter
          />
        </Grid>
      </Box>
    </>
  )
}
export default UserListPage
