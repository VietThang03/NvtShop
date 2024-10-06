import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import IconifyIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import FallbackSpinner from 'src/components/fall-back'
import CustomTextField from 'src/components/text-field'
import { getDetailsProductType } from 'src/services/product-type'
import { AppDispatch } from 'src/stores'
import { createProductTypeAsync, updateProductTypeAsync } from 'src/stores/apps/product-type/actions'
import * as yup from 'yup'

interface TProps {
  open: boolean
  onClose: () => void
  idProductType?: string
}

type TDefaultValue = {
  name: string
  slug: string
}

const CreateEditProductType = ({ onClose, open, idProductType }: TProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    name: yup.string().required(t('Required_field')),
    slug: yup.string().required(t('Required_field'))
  })

  const defaultValues: TDefaultValue = {
    name: '',
    slug: ''
  }

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit = handleSubmit((data: TDefaultValue) => {
    if (!Object.keys(errors).length) {
      if (!idProductType) {
        dispatch(
          createProductTypeAsync({
            name: data.name,
            slug: data.slug
          })
        )
      } else {
        //api update city
        dispatch(
          updateProductTypeAsync({
            name: data.name,
            slug: data.slug,
            id: idProductType
          })
        )
      }
    }
  })

  //fetch
  const fetchDetailProductType = async (id: string) => {
    setLoading(true)
    await getDetailsProductType(id)
      .then(res => {
        setLoading(false)
        const data = res.data
        //console.log("check data user>>>>", res);
        if (data) {
          reset({
            name: data?.name,
            slug: data?.slug
          })
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
    } else if (idProductType && open) {
      fetchDetailProductType(idProductType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idProductType])

  return (
    <>
      {loading && <FallbackSpinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: '20px',
            borderRadius: '15px'
          }}
          minWidth={{ md: '800px', xs: '80vw' }}
          maxWidth={{ md: '80vw', xs: '80vw' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              paddingBottom: '20px'
            }}
          >
            <Typography
              variant='h4'
              sx={{
                fontWeight: '600'
              }}
            >
              {' '}
              {idProductType ? t('Edit_delivery_type') : t('Create_delivery_type')}
            </Typography>
            <IconButton
              sx={{
                position: 'absolute',
                right: '0',
                top: '-5px'
              }}
              onClick={onClose}
            >
              <IconifyIcon icon='material-symbols-light:close' />
            </IconButton>
          </Box>
          <Divider />
          <form autoComplete='off' onSubmit={onSubmit} noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}>
              <Grid container item md={12} xs={12}>
                <Grid item md={12} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        required
                        fullWidth
                        label={t('Name_city')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('Enter_name_city')}
                        error={Boolean(errors?.name)}
                        helperText={errors?.name?.message}
                      />
                    )}
                    name='name'
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        required
                        disabled
                        fullWidth
                        label={t('Slug')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('Enter_slug')}
                        error={Boolean(errors?.slug)}
                        helperText={errors?.slug?.message}
                      />
                    )}
                    name='slug'
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idProductType ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditProductType
