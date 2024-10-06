import { yupResolver } from '@hookform/resolvers/yup'
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Switch,
  Typography,
  useTheme
} from '@mui/material'
import { relative } from 'path'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import IconifyIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomSelect from 'src/components/custom-select'
import FallbackSpinner from 'src/components/fall-back'
import CustomTextField from 'src/components/text-field'
import WrapperFileUpload from 'src/components/wrap-file-upload'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { getDetailsCity } from 'src/services/city'
import { getAllRoles, getDetailRole } from 'src/services/role'
import { getDetailsUser } from 'src/services/user'
import { AppDispatch } from 'src/stores'
import { createCityAsync, updateCityAsync } from 'src/stores/apps/city/action'
import { createUserAsync, updateUserAsync } from 'src/stores/apps/users/action'
import { convertBase64, separattionFullName, toFullName } from 'src/utils'
import { Schema, schema } from 'src/utils/rules'
import * as yup from 'yup'

interface TProps {
  open: boolean
  onClose: () => void
  idCity?: string
}

type TDefaultValue = {
  name: string
}

const CreateEditCity = ({ onClose, open, idCity }: TProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    name: yup.string().required(t('Required_field'))
  })

  const defaultValues: TDefaultValue = {
    name: ''
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
      if (!idCity) {
        dispatch(
          createCityAsync({
            name: data.name
          })
        )
      } else {
        //api update city
        dispatch(
          updateCityAsync({
            name: data.name,
            id: idCity
          })
        )
      }
    }
  })

  //fetch
  const fetchDetailCity = async (id: string) => {
    setLoading(true)
    await getDetailsCity(id)
      .then(res => {
        setLoading(false)
        const data = res.data
        //console.log("check data user>>>>", res);
        if (data) {
          reset({
            name: data?.name
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
    } else if (idCity && open) {
      fetchDetailCity(idCity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idCity])

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
              {idCity ? t('Edit_city') : t('Create_city')}
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
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idCity ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditCity
