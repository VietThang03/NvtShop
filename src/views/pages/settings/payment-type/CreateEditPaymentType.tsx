import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, FormHelperText, Grid, IconButton, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import IconifyIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomSelect from 'src/components/custom-select'
import FallbackSpinner from 'src/components/fall-back'
import CustomTextField from 'src/components/text-field'
import { PAYMENT_TYPES } from 'src/configs/payment'
import { getDetailsDeliveryType } from 'src/services/delivery-type'
import { getDetailsPaymentType } from 'src/services/payment-type'
import { AppDispatch } from 'src/stores'
import { createPaymentTypeAsync, updatePaymentTypeAsync } from 'src/stores/apps/payment-type/actions'
import * as yup from 'yup'

interface TProps {
  open: boolean
  onClose: () => void
  idPaymentType?: string
}

type TDefaultValue = {
  name: string
  type: string
}

const CreateEditPaymentType = ({ onClose, open, idPaymentType }: TProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
  const ObjectPaymentType:any = PAYMENT_TYPES()

  const schema = yup.object().shape({
    name: yup.string().required(t('Required_field')),
    type: yup.string().required(t('Required_field'))
  })

  const defaultValues: TDefaultValue = {
    name: '',
    type: ''
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
      if (!idPaymentType) {
        dispatch(
          createPaymentTypeAsync({
            name: data.name,
            type: data.type
          })
        )
      } else {
        dispatch(
          updatePaymentTypeAsync({
            name: data.name,
            type: data.type,
            id: idPaymentType
          })
        )
      }
    }
  })

  //fetch
  const fetchDetailsPaymentType = async (id: string) => {
    setLoading(true)
    await getDetailsPaymentType(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data?.name,
            type: data?.type
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
    } else if (idPaymentType && open) {
      fetchDetailsPaymentType(idPaymentType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idPaymentType])

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
              {idPaymentType ? t('Edit_payment_type') : t('Create_payment_type')}
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
                        label={t('type_payment_type')}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('Enter_name_payment_type')}
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
                    rules={{
                      required: true
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <div>
                        <label
                          style={{
                            fontSize: '13px',
                            marginBottom: '4px',
                            display: 'block',
                            color: errors?.type
                              ? theme.palette.error.main
                              : `rgba(${theme.palette.customColors.main}, 0.42)`
                          }}
                        >
                          {t('Type')}{' '}
                          <span
                            style={{
                              color: errors?.type
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            *
                          </span>
                        </label>
                        <CustomSelect
                          fullWidth
                          onChange={onChange}
                          options={Object.values(ObjectPaymentType)}
                          error={Boolean(errors?.type)}
                          onBlur={onBlur}
                          value={value}
                          placeholder={t('Select')}
                        />
                        {errors?.type && (
                          <FormHelperText
                            sx={{
                              color: errors?.type
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.main}, 0.42)`
                            }}
                          >
                            {errors?.type?.message}
                          </FormHelperText>
                        )}
                      </div>
                    )}
                    name='type'
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idPaymentType ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditPaymentType
