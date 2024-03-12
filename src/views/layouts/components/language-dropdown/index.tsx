import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/components/Icon'
import { LANGUAGE_OPTION } from 'src/configs/i18n'

export const LanguageDropdown = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const {i18n} = useTranslation()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const handleChangeLanguage = (value: string) => {
    i18n.changeLanguage(value)
  }
  return (
    <>
      <IconButton color='inherit' id='language-dropdown' onClick={handleClick}>
        <IconifyIcon icon='material-symbols-light:translate' />
      </IconButton>
      <Menu
        id={'language-dropdown'}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx:{
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root':{
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
            },
            '&::before':{
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
            }
          }
        }}
        transformOrigin={{
            horizontal: 'right',
            vertical: 'top'
        }}
        anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom'
        }}
      >
        {LANGUAGE_OPTION.map((item: {lang: string, value: string}) => (
             <MenuItem key={item.value} selected={item.value === i18n.language} onClick={() => handleChangeLanguage(item.value)}>
             <Typography>{item.lang}</Typography>
           </MenuItem>
   
        ))}
      </Menu>
    </>
  )
}
