import { yupResolver } from '@hookform/resolvers/yup'
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
  useTheme
} from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'
import WrapperFileUpload from 'src/components/wrap-file-upload'
import { useAuth } from 'src/hooks/useAuth'
import { Schema, schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'email' | 'address' | 'city' | 'fullName' | 'phoneNumber' | 'role'>
const registerSchema = schema.pick(['email', 'address', 'city', 'fullName', 'phoneNumber', 'role'])

const MyProfilePage = () => {
  const { t } = useTranslation()
  const {user} = useAuth()
  const theme = useTheme()
  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
    reset
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      address: '',
      city: '',
      phoneNumber: '',
      role: '',
      fullName: ''
    },
    resolver: yupResolver(registerSchema)
  })
  const onSubmit = handleSubmit(data => {
    console.log(data)
  })
  const handleUploadAvatar = (file: File) => {}

  useEffect(() => {
    if(user){
      reset({
        role: user?.role?.name,
        email: user?.email
      })
    }
  }, [reset, user])
  
  return (
    <form autoComplete='off' onSubmit={onSubmit} noValidate>
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
          width: '100%',
          height: '100%',
          p: 4
        }}
      >
        <Grid container spacing={5}>
          <Grid container item md={6} xs={12} spacing={5}>
            <Grid item md={12} xs={12}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '30px'
                }}
              >
                <Avatar
                  sx={{
                    width: '100px',
                    height: '100px'
                  }}
                >
                  {/* <Image/> */}
                  <IconifyIcon icon='ph:user-thin' fontSize={50} />
                </Avatar>
                <WrapperFileUpload objectAcceptFile={{
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"]
                }} uploadFunc={handleUploadAvatar}>
                  <Button
                    variant='outlined'
                    sx={{
                      mt: 3,
                      mb: 2,
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <IconifyIcon icon='material-symbols:drive-folder-upload-rounded' /> {t('Upload')}
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
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    autoComplete='email'
                    autoFocus
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors?.email)}
                    placeholder='Enter your email...'
                  />
                )}
                name='email'
              />
              <Box sx={{ height: '1rem' }}>
                {errors.email && (
                  <Typography
                    sx={{
                      color: '#f00',
                      fontSize: '12px'
                    }}
                  >
                    {errors.email?.message}
                  </Typography>
                )}
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
                    margin='normal'
                    required
                    fullWidth
                    disabled
                    id='role'
                    label='Role'
                    name='role'
                    autoComplete='role'
                    autoFocus
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors?.email)}
                    placeholder='Input role...'
                  />
                )}
                name='role'
              />
              <Box sx={{ height: '1rem' }}>
                {errors.email && (
                  <Typography
                    sx={{
                      color: '#f00',
                      fontSize: '12px'
                    }}
                  >
                    {errors.role?.message}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          <Grid container md={6} xs={12} item spacing={5}>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    margin='normal'
                    required
                    fullWidth
                    id='address'
                    label='Address'
                    name='address'
                    autoComplete='address'
                    autoFocus
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors?.email)}
                    placeholder='Enter your address...'
                  />
                )}
                name='address'
              />
              <Box sx={{ height: '1rem' }}>
                {errors.email && (
                  <Typography
                    sx={{
                      color: '#f00',
                      fontSize: '12px'
                    }}
                  >
                    {errors.address?.message}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    margin='normal'
                    required
                    fullWidth
                    id='city'
                    label='City'
                    name='city'
                    autoComplete='city'
                    autoFocus
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors?.email)}
                    placeholder='Enter your city...'
                  />
                )}
                name='city'
              />
              <Box sx={{ height: '1rem' }}>
                {errors.email && (
                  <Typography
                    sx={{
                      color: '#f00',
                      fontSize: '12px'
                    }}
                  >
                    {errors.city?.message}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item md={6} xs={12}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    margin='normal'
                    required
                    fullWidth
                    id='phoneNumber'
                    label='Phone Number'
                    name='phoneNumber'
                    autoComplete='phoneNumber'
                    autoFocus
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors?.email)}
                    placeholder='Enter your phone number...'
                  />
                )}
                name='phoneNumber'
              />
              <Box sx={{ height: '1rem' }}>
                {errors.email && (
                  <Typography
                    sx={{
                      color: '#f00',
                      fontSize: '12px'
                    }}
                  >
                    {errors.phoneNumber?.message}
                  </Typography>
                )}
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
                    margin='normal'
                    required
                    fullWidth
                    id='fullName'
                    label='FullName'
                    name='fullName'
                    autoComplete='fullName'
                    autoFocus
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    // error={Boolean(errors?.email)}
                    placeholder='Enter your full name...'
                  />
                )}
                name='fullName'
              />
              <Box sx={{ height: '1rem' }}>
                {errors.email && (
                  <Typography
                    sx={{
                      color: '#f00',
                      fontSize: '12px'
                    }}
                  >
                    {errors.fullName?.message}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Card>

      <Box sx={{ mt: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, borderRadius: '5px' }}>
          {t('Save')}
        </Button>
      </Box>
    </form>
  )
}

export default MyProfilePage
