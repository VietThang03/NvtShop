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
import { getAllRoles, getDetailRole } from 'src/services/role'
import { getDetailsUser } from 'src/services/user'
import { AppDispatch } from 'src/stores'
import { createUserAsync, updateUserAsync } from 'src/stores/apps/users/action'
import { convertBase64, separattionFullName, toFullName } from 'src/utils'
import { Schema, schema } from 'src/utils/rules'
import * as yup from 'yup'

interface TProps {
  open: boolean
  onClose: () => void
  idUser?: string
}

type TDefaultValue = {
  password?: string
  fullName: string
  email: string
  role: string
  phoneNumber: string
  address?: string
  status?: number
  city?: string
}

const CreateEditUser = ({ onClose, open, idUser }: TProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    email: yup.string().required('Required field').matches(EMAIL_REG, 'This field must be an email'),
    password: idUser
      ? yup.string().nonNullable()
      : yup
          .string()
          .required('Required field')
          .matches(
            PASSWORD_REG,
            'Password must contain at least 1 uppercase letter, lowercase letter, number, special character, and be at least 6 characters long'
          ),
    fullName: yup.string().required('Required field'),
    phoneNumber: yup.string().required('Required field').min(9, 'The phone number is min 9 number'),
    role: yup.string().required('Required field'),
    city: yup.string().nonNullable(),
    address: yup.string().nonNullable(),
    status: yup.number().nonNullable()
  })

  const defaultValues: TDefaultValue = {
    password: '',
    fullName: '',
    email: '',
    role: '',
    phoneNumber: '',
    address: '',
    status: 1,
    city: ''
  }

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
    reset
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit = handleSubmit((data: TDefaultValue) => {
    const { firstName, lastName, middleName } = separattionFullName(data.fullName, i18n.language)
    if (!Object.keys(errors).length) {
      if (!idUser) {
        dispatch(
          createUserAsync({
            firstName,
            lastName,
            middleName,
            password: data?.password ? data?.password : '',
            phoneNumber: data.phoneNumber,
            role: data?.role,
            email: data.email,
            city: data.city,
            address: data?.address,
            avatar: avatar
          })
        )
      } else {
        //api update role
        dispatch(
          updateUserAsync({
            firstName,
            lastName,
            middleName,
            phoneNumber: data.phoneNumber,
            role: data?.role,
            email: data.email,
            city: data.city,
            address: data?.address,
            avatar: avatar,
            id: idUser,
            status: data.status ? 1 : 0
          })
        )
      }
    }
  })

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  //fetch
  const fetchDetailUser = async (id: string) => {
    setLoading(true)
    await getDetailsUser(id)
      .then(res => {
        setLoading(false)
        const data = res.data
        //console.log("check data user>>>>", res);
        if (data) {
          reset({
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
            password: data.password,
            phoneNumber: data.phoneNumber,
            role: data?.role?._id,
            email: data.email,
            city: data.city,
            address: data?.address,
            status: data?.status
          })
          setAvatar(data?.avatar)
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const fetchAllRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.roles
        if (data) {
          setOptionRoles(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
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
    } else if (idUser  && open) {
      fetchDetailUser(idUser)
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idUser])

  useEffect(() => {
    if (open) {
      fetchAllRoles()
    }
  }, [open])

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
              {!idUser ? 'Create User' : 'Update User'}
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
              <Grid container spacing={5}>
                <Grid container item md={6} xs={12}>
                  <Box sx={{ height: '100%', width: '100%' }}>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            {avatar && (
                              <IconButton
                                sx={{
                                  position: 'absolute',
                                  bottom: -4,
                                  right: -6,
                                  zIndex: 2,
                                  color: theme.palette.error.main
                                }}
                                edge='start'
                                color='inherit'
                                onClick={() => setAvatar('')}
                              >
                                <IconifyIcon icon='material-symbols-light:delete-outline' />
                              </IconButton>
                            )}
                            {avatar ? (
                              <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                                <IconifyIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            ) : (
                              <Avatar sx={{ width: 100, height: 100 }}>
                                <IconifyIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            )}
                          </Box>
                          <WrapperFileUpload
                            uploadFunc={handleUploadAvatar}
                            objectAcceptFile={{
                              'image/jpeg': ['.jpg', '.jpeg'],
                              'image/png': ['.png']
                            }}
                          >
                            <Button
                              variant='outlined'
                              sx={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <IconifyIcon icon='ph:camera-thin'></IconifyIcon>
                              {avatar ? 'Change avatar' : 'Upload avatar'}
                            </Button>
                          </WrapperFileUpload>
                        </Box>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          rules={{
                            required: true
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Email')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={'Enter your email'}
                              error={Boolean(errors?.email)}
                              helperText={errors?.email?.message}
                            />
                          )}
                          name='email'
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
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
                                  color: errors?.role
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {t('Role')}{' '}
                                <span
                                  style={{
                                    color: errors?.role
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
                                options={optionRoles}
                                error={Boolean(errors?.role)}
                                onBlur={onBlur}
                                value={value}
                                placeholder={'Enter your role'}
                              />
                              {errors?.role && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.role
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  {errors?.role?.message}
                                </FormHelperText>
                              )}
                            </div>
                          )}
                          name='role'
                        />
                      </Grid>
                      {!idUser && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            rules={{
                              required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                              <CustomTextField
                                required
                                fullWidth
                                label={'Password'}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder={'Enter password'}
                                error={Boolean(errors?.password)}
                                helperText={errors?.password?.message}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position='end'>
                                      <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                          <IconifyIcon icon='material-symbols:visibility-outline' />
                                        ) : (
                                          <IconifyIcon icon='ic:outline-visibility-off' />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            )}
                            name='password'
                          />
                        </Grid>
                      )}
                      {idUser && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={e => {
                                        onChange(e.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? 'Active' : 'Block'}
                                />
                              )
                            }}
                            name='status'
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>
                <Grid container item md={6} xs={12}>
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={'Full name'}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={'Enter your full name'}
                              error={Boolean(errors?.fullName)}
                              helperText={errors?.fullName?.message}
                            />
                          )}
                          name='fullName'
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          name='address'
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              fullWidth
                              label={'Address'}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={'Enter your address'}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          name='city'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.city
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {'City'}
                              </InputLabel>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                options={optionCities}
                                error={Boolean(errors?.city)}
                                onBlur={onBlur}
                                value={value}
                                placeholder={'Enter  your city'}
                              />
                              {errors?.city?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.city
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  {errors?.city?.message}
                                </FormHelperText>
                              )}
                            </Box>
                          )}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={'Phone number'}
                              onChange={e => {
                                const numValue = e.target.value.replace(/\D/g, '')
                                onChange(numValue)
                              }}
                              inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                minLength: 8
                              }}
                              onBlur={onBlur}
                              value={value}
                              placeholder={'Enter your phone'}
                              error={Boolean(errors?.phoneNumber)}
                              helperText={errors?.phoneNumber?.message}
                            />
                          )}
                          name='phoneNumber'
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button
                type='submit'
                variant='contained'
                sx={{
                  mt: 3,
                  mb: 2
                }}
              >
                {idUser ? 'Create' : 'Update'}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditUser
