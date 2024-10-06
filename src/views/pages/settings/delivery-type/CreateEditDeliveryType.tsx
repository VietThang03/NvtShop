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
import { getDetailsDeliveryType } from 'src/services/delivery-type'
import { getDetailsUser } from 'src/services/user'
import { AppDispatch } from 'src/stores'
import { createDeliveryTypeAsync, updateDeliveryTypeAsync } from 'src/stores/apps/delivery-type/actions'
import * as yup from 'yup'

interface TProps {
  open: boolean
  onClose: () => void
  idDeliveryType?: string
}

type TDefaultValue = {
  name: string
  price: string
}

const CreateEditDeliveryType = ({ onClose, open, idDeliveryType }: TProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    name: yup.string().required(t('Required_field')),
    price: yup
      .string()
      .required(t('Required_field'))
      .test('least_value_price', t('least_1000_in_price'), value => {
        return Number(value) >= 1000
      })
  })

  const defaultValues: TDefaultValue = {
    name: '',
    price: ''
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
      if (!idDeliveryType) {
        dispatch(
          createDeliveryTypeAsync({
            name: data.name,
            price: data.price
          })
        )
      } else {
        //api update city
        dispatch(
          updateDeliveryTypeAsync({
            name: data.name,
            price: data.price,
            id: idDeliveryType
          })
        )
      }
    }
  })

  //fetch
  const fetchDetailDeliveryType = async (id: string) => {
    setLoading(true)
    await getDetailsDeliveryType(id)
      .then(res => {
        setLoading(false)
        const data = res.data
        //console.log("check data user>>>>", res);
        if (data) {
          reset({
            name: data?.name,
            price: data?.price
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
      setAvatar('')
      setShowPassword(false)
    } else if (idDeliveryType && open) {
      fetchDetailDeliveryType(idDeliveryType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idDeliveryType])

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
              {idDeliveryType ? t('Edit_delivery_type') : t('Create_delivery_type')}
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
                        fullWidth
                        label={t('Price_delivery_type')}
                        onChange={e => {
                          const numValue = e.target.value.replace(/\D/g, '')
                          onChange(numValue)
                        }}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*'
                        }}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('Enter_price_delivery_type')}
                        error={Boolean(errors?.price)}
                        helperText={errors?.price?.message}
                      />
                    )}
                    name='price'
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idDeliveryType ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditDeliveryType
