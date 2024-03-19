import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Avatar, Box, Button, Card, Grid, IconButton, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import IconifyIcon from 'src/components/Icon'
import FallbackSpinner from 'src/components/fall-back'
import ModalSpinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import WrapperFileUpload from 'src/components/wrap-file-upload'
import { UserDataType } from 'src/contexts/types'
import { getAuthMe } from 'src/services/auth'
import { AppDispatch, RootState } from 'src/stores'
import { updateAuthMe } from 'src/stores/apps/auth/actions'
import { convertBase64, separattionFullName, toFullName } from 'src/utils'
import { Schema, schema } from 'src/utils/rules'

type FormData = Pick<Schema, 'email' | 'address' | 'city' | 'fullName' | 'phoneNumber' | 'role'>
const updateSchema = schema.pick(['email', 'address', 'city', 'fullName', 'phoneNumber', 'role'])

const MyProfilePage = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserDataType | null>(null)
  const [roleId, setRoleId] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('')
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const {
    handleSubmit,
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
    resolver: yupResolver(updateSchema)
  })
  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async res => {
        setLoading(false)
        setUser({ ...res.data.data })
        const data = res?.data
        if (data) {
          setRoleId(data?.role?._id)
          setAvatar(data?.avatar)
          reset({
            role: data?.role?.name,
            email: data?.email,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
            city: data?.city,
            address: data?.address,
            phoneNumber: data?.phoneNumber
          })
        }
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }
  const onSubmit = handleSubmit(data => {
    const {firstName, lastName, middleName} = separattionFullName(data.fullName, i18n.language)
    dispatch(
      updateAuthMe({
        email: data.email,
        avatar,
        firstName,
        lastName,
        middleName,
        role: roleId,
        phoneNumber: data.phoneNumber
      })
    )
  })
  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  useEffect(() => {
    fetchGetAuthMe()
  }, [i18n.language])

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        fetchGetAuthMe()
      }
    }
  }, [messageUpdateMe, isErrorUpdateMe, isSuccessUpdateMe])

  return (
    <>
      {loading || (isLoading && <ModalSpinner />)}
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
                  <Box
                    sx={{
                      position: 'relative'
                    }}
                  >
                    {avatar && (
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-6px',
                          zIndex: 2,
                          color: theme.palette.error.main
                        }}
                        edge='start'
                        color='inherit'
                        onClick={() => setAvatar('')}
                      >
                        <Icon icon='material-symbols-light:delete-outline' />
                      </IconButton>
                    )}
                    {avatar ? (
                      <Avatar
                        sx={{
                          width: '100px',
                          height: '100px'
                        }}
                        src={avatar}
                      ></Avatar>
                    ) : (
                      <Avatar
                        sx={{
                          width: '100px',
                          height: '100px'
                        }}
                      >
                        {/* <Image/> */}
                        <IconifyIcon icon='ph:user-thin' fontSize={50} />
                      </Avatar>
                    )}
                  </Box>
                  <WrapperFileUpload
                    objectAcceptFile={{
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'image/png': ['.png']
                    }}
                    uploadFunc={handleUploadAvatar}
                  >
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
                      <IconifyIcon icon='material-symbols:drive-folder-upload-rounded' />
                      {avatar ? 'Change image' : t('Upload')}
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
                      disabled
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
                  {errors.role && (
                    <Typography
                      sx={{
                        color: '#f00',
                        fontSize: '12px'
                      }}
                    >
                      {errors.role.message}
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
                  {errors.address && (
                    <Typography
                      sx={{
                        color: '#f00',
                        fontSize: '12px'
                      }}
                    >
                      {errors.address.message}
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
                  {errors.city && (
                    <Typography
                      sx={{
                        color: '#f00',
                        fontSize: '12px'
                      }}
                    >
                      {errors.city.message}
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
                      // error={Boolean(errors?.email)}
                      placeholder='Enter your phone number...'
                    />
                  )}
                  name='phoneNumber'
                />
                <Box sx={{ height: '1rem' }}>
                  {errors.phoneNumber && (
                    <Typography
                      sx={{
                        color: '#f00',
                        fontSize: '12px'
                      }}
                    >
                      {errors.phoneNumber.message}
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
                  {errors.fullName && (
                    <Typography
                      sx={{
                        color: '#f00',
                        fontSize: '12px'
                      }}
                    >
                      {errors.fullName.message}
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
    </>
  )
}

export default MyProfilePage
