import { Box, Grid, Typography, useTheme } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CustomDataGrid from 'src/components/custom-data-grid'
import { AppDispatch, RootState } from 'src/stores'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import FallbackSpinner from 'src/components/fall-back'
import toast from 'react-hot-toast'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermission } from 'src/hooks/usePermission'
import TableHeader from 'src/components/table-header'
import CreateEditCity from './CreateEditCity'
import { deleteCityAsync, deleteMultipleCityAsync, getAllCitiesAsync } from 'src/stores/apps/city/action'
import { OBJECT_TYPE_ERROR_CITY } from 'src/configs/error'
import { formatDate } from 'src/utils/date'
import { resetInitialState } from 'src/stores/apps/city'

const CityListPage = () => {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteCity, setOpenDeleteCity] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleCity, setOpenDeleteMultipleCity] = useState(false)
  const [sortBy, setSortBy] = useState<string>('created desc')
  const [searchBy, setSearchBy] = useState<string>('')
  const [selectedRow, setSelectedRow] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  //permission
  const { CREATE, DELETE, UPDATE, VIEW } = usePermission('SETTING.CITY', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])
  const theme = useTheme()
  const dispatch: AppDispatch = useDispatch()
  const {
    cities,
    isErrorCreateEdit,
    isErrorDelete,
    isErrorMultipleDelete,
    isLoading,
    isSuccessCreateEdit,
    isSuccessDelete,
    isSuccessMultipleDelete,
    messageErrorCreateEdit,
    messageErrorDelete,
    messageErrorMultipleDelete,
    typeError
  } = useSelector((state: RootState) => state.city)

  //column city
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.name}</Typography>
      }
    },
    {
      field: 'createdAt',
      headerName: t('Created_date'),
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return <Typography>{formatDate(row?.createdAt, { dateStyle: 'short' })}</Typography>
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
                  setOpenDeleteCity({
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

  const handleGetListCity = () => {
    dispatch(getAllCitiesAsync({ params: { limit: pageSize, page: page, search: searchBy, order: sortBy } }))
  }

  const handleCloseConfirmDeleteCity = () => {
    setOpenDeleteCity({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleCity = useCallback(() => {
    setOpenDeleteMultipleCity(false)
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
        rowLength={cities.total}
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

  const handleDeleteCity = () => {
    dispatch(deleteCityAsync(openDeleteCity.id))
  }

  const handleDeleteMultipleCity = () => {
    dispatch(
      deleteMultipleCityAsync({
        cityIds: selectedRow
      })
    )
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenDeleteMultipleCity(true)
        break
      }
    }
  }

  useEffect(() => {
    handleGetListCity()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_city_success'))
      } else {
        toast.success(t('Update_city_success'))
      }
      handleGetListCity()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_CITY[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_city_error'))
        } else {
          toast.error(t('Create_city_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('Delete_multiple_city_success'))
      handleGetListCity()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteCity()
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('Delete_multiple_city_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_city_success'))
      handleGetListCity()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteCity()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_city_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <FallbackSpinner />}
      <ConfirmationDialog
        open={openDeleteCity.open}
        handleClose={handleCloseConfirmDeleteCity}
        handleCancel={handleCloseConfirmDeleteCity}
        handleConfirm={handleDeleteCity}
        title={t('Title_delete_city')}
        description={t('Confirm_delete_city')}
      />
      <ConfirmationDialog
        open={openDeleteMultipleCity}
        handleClose={handleCloseConfirmDeleteMultipleCity}
        handleCancel={handleCloseConfirmDeleteMultipleCity}
        handleConfirm={handleDeleteMultipleCity}
        title={t('Title_delete_multiple_city')}
        description={t('Confirm_delete_multiple_city')}
      />
      <CreateEditCity open={openCreateEdit.open} onClose={handleCloseCreateEdit} idCity={openCreateEdit.id} />
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
              actions={[{ label: 'Delete', value: 'delete', disabled: !DELETE }]}
              handleAction={handleAction}
            />
          )}

          <CustomDataGrid
            rows={cities.data}
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
            rowSelectionModel={selectedRow}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              setSelectedRow(row as string[])
            }}
            disableColumnFilter
          />
        </Grid>
      </Box>
    </>
  )
}
export default CityListPage
