import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { relative } from 'path'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import IconifyIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import FallbackSpinner from 'src/components/fall-back'
import CustomTextField from 'src/components/text-field'
import { getDetailRole } from 'src/services/role'
import { AppDispatch } from 'src/stores'
import { createRolesAsync, updateRolesAsync } from 'src/stores/apps/role/action'
import { Schema, schema } from 'src/utils/rules'

interface TProps {
  open: boolean
  onClose: () => void
  idRole?: string
}

type FormData = Pick<Schema, 'name'>
const RoleNameSchema = schema.pick(['name'])

const CreateEditRole = ({ onClose, open, idRole }: TProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const theme = useTheme()
  const dispatch: AppDispatch = useDispatch()
  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
    reset
  } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(RoleNameSchema)
  })

  const onSubmit = handleSubmit((data: { name: string }) => {
    if (!Object.keys(errors).length) {
      if (!idRole) {
        dispatch(createRolesAsync(data))
      } else {
        //api update role
        dispatch(updateRolesAsync({ name: data.name, id: idRole }))
      }
    }
  })

  //fetch
  const fetchDetailRole = async (id: string) => {
    setLoading(true)
    await getDetailRole(id)
      .then(res => {
        setLoading(false)
        const data = res.data
        if (data) {
          reset({
            name: data?.name
          })
        }
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!open) {
      reset({
        name: ''
      })
    } else if (idRole) {
      fetchDetailRole(idRole)
    }
  }, [open, idRole])

  return (
    <>
      {loading && <FallbackSpinner/>}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: '20px',
            borderRadius: '8px'
          }}
          minWidth={{ md: '450px', xs: '80vw' }}
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
              {!idRole ? 'Create Role' : 'Update Role'}
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
            <Box sx={{ width: '100%' }}>
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
                      name='name'
                      label='Name'
                      type='text'
                      id='name'
                      //   autoComplete='current-password'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      // error={Boolean(errors?.password)}
                      placeholder='Enter confirm new password...'
                    />
                  )}
                  name='name'
                />
                <Box sx={{ height: '1rem' }}>
                  {errors.name && (
                    <Typography
                      sx={{
                        color: '#f00',
                        fontSize: '12px'
                      }}
                    >
                      {errors.name.message}
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

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                  {!idRole ? 'Create' : 'Update'}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditRole
