import { Box, Chip, Grid, styled, Typography, useTheme } from '@mui/material'
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
import { OBJECT_TYPE_ERROR_DELIVERY, OBJECT_TYPE_ERROR_PRODUCT_TYPE } from 'src/configs/error'
import { formatDate } from 'src/utils/date'
import { resetInitialState } from 'src/stores/apps/product-type'
import CreateEditProduct from './CreateEditProduct'
import { ChipProps } from '@mui/material'
import { formatNumberToLocal } from 'src/utils'
import { deleteMultipleProductAsync, deleteProductAsync, getAllProductsAsync } from 'src/stores/apps/product/actions'
import { getAllProductTypes } from 'src/services/product-type'

const ActiveProductStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#28c76f29',
  color: '#3a843f',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const DeactivateProductStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#da251d29',
  color: '#da251d',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const ProductListPage = () => {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteProduct, setOpenDeleteProduct] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleProduct, setOpenDeleteMultipleProduct] = useState(false)
  const [sortBy, setSortBy] = useState<string>('created desc')
  const [searchBy, setSearchBy] = useState<string>('')
  const [selectedRow, setSelectedRow] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [optionTypes, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  //permission
  const { CREATE, DELETE, UPDATE, VIEW } = usePermission('MANAGE_PRODUCT.PRODUCT', [
    'CREATE',
    'VIEW',
    'UPDATE',
    'DELETE'
  ])
  const theme = useTheme()
  const dispatch: AppDispatch = useDispatch()
  const {
    products,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete
  } = useSelector((state: RootState) => state.product)

  //column product
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return (
          <Typography sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            {row?.name}
          </Typography>
        )
      }
    },
    {
      field: 'type',
      headerName: t('type'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.type.name}</Typography>
      }
    },
    {
      field: 'price',
      headerName: t('Price'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{`${formatNumberToLocal(row?.price)} VND`}</Typography>
      }
    },
    {
      field: 'countInStock',
      headerName: t('Count_in_stock'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.countInStock}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('Status'),
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return (
          <>
            {row.status ? (
              <ActiveProductStyled label={t('Public')} />
            ) : (
              <DeactivateProductStyled label={t('Private')} />
            )}
          </>
        )
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
                  setOpenDeleteProduct({
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

  const handleGetListProduct = () => {
    dispatch(getAllProductsAsync({ params: { limit: pageSize, page: page, search: searchBy, order: sortBy } }))
  }

  const handleCloseConfirmDeleteProductType = () => {
    setOpenDeleteProduct({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleProductType = useCallback(() => {
    setOpenDeleteMultipleProduct(false)
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
        rowLength={products.total}
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

  const handleDeleteProductType = () => {
    dispatch(deleteProductAsync(openDeleteProduct.id))
  }

  const handleDeleteMultipleDeliveryType = () => {
    dispatch(
      deleteMultipleProductAsync({
        productIds: selectedRow
      })
    )
  }

  const handleAction = (action: string) => {
    switch (action) {
      case 'delete': {
        setOpenDeleteMultipleProduct(true)
        break
      }
    }
  }

  //fecth api
  const fetchAllTypes = async () => {
    setLoading(true)
    await getAllProductTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.productTypes
        if (data) {
          setOptionTypes(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAllTypes()
  }, [])

  useEffect(() => {
    handleGetListProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, page, pageSize])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_product_type_success'))
      } else {
        toast.success(t('Update_product_type_success'))
      }
      handleGetListProduct()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_PRODUCT_TYPE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_product_type_error'))
        } else {
          toast.error(t('Create_product_type_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('Delete_multiple_product_type_success'))
      handleGetListProduct()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteProductType()
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('Delete_multiple_product_type_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_product_type_success'))
      handleGetListProduct()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteProductType()
    } else {
      toast.error(t('Delete_product_type_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <FallbackSpinner />}
      <ConfirmationDialog
        open={openDeleteProduct.open}
        handleClose={handleCloseConfirmDeleteProductType}
        handleCancel={handleCloseConfirmDeleteProductType}
        handleConfirm={handleDeleteProductType}
        title={t('Title_delete_product_type')}
        description={t('Confirm_delete_product_type')}
      />
      <ConfirmationDialog
        open={openDeleteMultipleProduct}
        handleClose={handleCloseConfirmDeleteMultipleProductType}
        handleCancel={handleCloseConfirmDeleteMultipleProductType}
        handleConfirm={handleDeleteMultipleDeliveryType}
        title={t('Title_delete_multiple_product_type')}
        description={t('Confirm_delete_multiple_product_type')}
      />
      <CreateEditProduct
        open={openCreateEdit.open}
        onClose={handleCloseCreateEdit}
        idProduct={openCreateEdit.id}
        optionTypes={optionTypes}
      />
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
            rows={products.data}
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
export default ProductListPage
