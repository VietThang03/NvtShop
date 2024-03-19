import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  useTheme
} from '@mui/material'
import { NextPage } from 'next'
import CustomTextField from 'src/components/text-field'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from 'src/utils/rules'
import { useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import LoginDark from '/public/images/login-dark.png'
import LoginLight from '/public/images/login-light.png'
import Image from 'next/image'
import GoogleSvg from '/public/svgs/google.svg'
import FacebookSvg from '/public/svgs/facebook.svg'
import Link from 'next/link'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'

type TProps = {}
const loginSchema = schema.pick(['email', 'password'])
type FormData = Pick<Schema, 'email' | 'password'>

const LoginPage: NextPage<TProps> = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isRemember, setIsRemember] = useState<boolean>(true)
  const { login } = useAuth()
  const theme = useTheme()
  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control
  } = useForm<FormData>({
    defaultValues: {
      email: 'admin@gmail.com',
      password: '123456@Admin'
    },
    resolver: yupResolver(loginSchema)
  })
  const onSubmit = handleSubmit((data: { email: string; password: string }) => {
    if(!Object.keys(errors)?.length){
      login({ ...data, rememberMe: isRemember }, (err) => {
        if(err?.response?.data?.typeError === "INVALID"){
          toast.error('The email or password is wrong')
        }
        // setError('email', {type: 'invalid', message: 'The email or password is wrong'})
      })
    }
  })
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
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
          src={theme.palette.mode === 'light' ? LoginLight : LoginDark}
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
            Sign in
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
                      id='email'
                      label='Email Address'
                      name='email'
                      autoComplete='email'
                      autoFocus
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      // error={Boolean(errors?.email)}
                      placeholder='Input email...'
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
                      {errors.email.message}
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
                      name='password'
                      label='Password'
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      autoComplete='current-password'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      // error={Boolean(errors?.password)}
                      placeholder='Input password...'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? (
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
                  name='password'
                />
                <Box sx={{ height: '1rem' }}>
                  {errors.password && (
                    <Typography
                      sx={{
                        color: '#f00',
                        fontSize: '12px'
                      }}
                    >
                      {errors.password?.message}
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
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value='remember'
                      color='primary'
                      checked={isRemember}
                      onChange={e => setIsRemember(e.target.checked)}
                    />
                  }
                  label='Remember me'
                />
                <Link
                  href='#'
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid
                container
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Grid item>{"Don't have an account?"}</Grid>
                <Grid item>
                  <Link
                    href='/register'
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white
                    }}
                  >
                    Sign up
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <Typography
              sx={{
                textAlign: 'center',
                mt: 2,
                mb: 2
              }}
            >
              Or
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5
              }}
            >
              <IconButton
                sx={{
                  color: theme.palette.error.main
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  role='img'
                  fontSize='1.375rem'
                  className='iconify iconify--mdi'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                  ></path>
                </svg>
              </IconButton>
              <IconButton
                sx={{
                  color: '#497ce2'
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                  role='img'
                  fontSize='1.375rem'
                  className='iconify iconify--mdi'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                  ></path>
                </svg>
              </IconButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
