import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, CssBaseline, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import IconifyIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'
import { AppDispatch, RootState } from 'src/stores'
import { Schema, schema } from 'src/utils/rules'
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'
import { changePasswordMe } from 'src/stores/apps/auth/actions'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/apps/auth'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}

type FormData = Pick<Schema, 'currentPassword' | 'newPassword' | 'confirmNewPassword'>
const changePasswordSchema = schema.pick(['currentPassword', 'newPassword', 'confirmNewPassword'])

const ChangePasswordPage: NextPage<TProps> = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()
  const {logout} = useAuth()
  const { isErrorChangePassword, isLoading, isSuccessChangePassword, messageChangePassword } = useSelector((state: RootState) => state.auth)
  const theme = useTheme()
  const router = useRouter()
  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
    reset
  } = useForm<FormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    resolver: yupResolver(changePasswordSchema)
  })
  const onSubmit = handleSubmit(data => {
    if(!Object.keys(errors).length){
      dispatch(changePasswordMe({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }))
    }
  })
  useEffect(() => {
    if(messageChangePassword){
      if(isErrorChangePassword){
        toast.error(messageChangePassword)
      }else if(isSuccessChangePassword){
        toast.success(messageChangePassword)
        setTimeout(() => {
          logout()
        },1000)
      }
    }
    dispatch(resetInitialState())
  },[isErrorChangePassword, isSuccessChangePassword, messageChangePassword])
  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '40px'
        }}
      >
        <Box
          display={{
            md: 'flex',
            xs: 'none',
            sm: ' flex'
          }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            backgroundColor: theme.palette.customColors.bodyBg,
            height: '100%',
            minWidth: '50vw'
          }}
        >
          <Image
            src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
            alt='Login image'
            style={{
              height: '100%',
              width: 'auto'
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography
              component='h1'
              variant='h5'
              sx={{
                color: theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
              }}
            >
              Register
            </Typography>
            <form autoComplete='off' onSubmit={onSubmit} noValidate>
              <Box sx={{ mt: 1 }}>
                <Box>
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
                        id='currentPassword'
                        label='Current Password'
                        name='currentPassword'
                        autoComplete='currentPassword'
                        type={showCurrentPassword ? 'text' : 'password'}
                        autoFocus
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        // error={Boolean(errors?.email)}
                        placeholder='Enter your current password...'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton edge='end' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                {showCurrentPassword ? (
                                  <IconifyIcon icon='material-symbols:visibility-rounded' />
                                ) : (
                                  <IconifyIcon icon='material-symbols:visibility-off-rounded' />
                                )}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                    name='currentPassword'
                  />
                  <Box sx={{ height: '1rem' }}>
                    {errors.currentPassword && (
                      <Typography
                        sx={{
                          color: '#f00',
                          fontSize: '12px'
                        }}
                      >
                        {errors.currentPassword.message}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box>
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
                        name='newPassword'
                        label='New password'
                        type={showNewPassword ? 'text' : 'password'}
                        id='newPassword'
                        autoComplete='newPassword'
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        // error={Boolean(errors?.password)}
                        placeholder='Enter your new password...'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton edge='end' onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? (
                                  <IconifyIcon icon='material-symbols:visibility-rounded' />
                                ) : (
                                  <IconifyIcon icon='material-symbols:visibility-off-rounded' />
                                )}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                    name='newPassword'
                  />
                  <Box sx={{ height: '1rem' }}>
                    {errors.newPassword && (
                      <Typography
                        sx={{
                          color: '#f00',
                          fontSize: '12px'
                        }}
                      >
                        {errors.newPassword.message}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box>
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
                        name='confirmNewPassword'
                        label='Confirm new password'
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        id='confirmNewPassword'
                        //   autoComplete='current-password'
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        // error={Boolean(errors?.password)}
                        placeholder='Enter confirm new password...'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton edge='end' onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                                {showConfirmNewPassword ? (
                                  <IconifyIcon icon='material-symbols:visibility-rounded' />
                                ) : (
                                  <IconifyIcon icon='material-symbols:visibility-off-rounded' />
                                )}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                    name='confirmNewPassword'
                  />
                  <Box sx={{ height: '1rem' }}>
                    {errors.confirmNewPassword && (
                      <Typography
                        sx={{
                          color: '#f00',
                          fontSize: '12px'
                        }}
                      >
                        {errors.confirmNewPassword.message}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                ></Box>

                <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ChangePasswordPage
