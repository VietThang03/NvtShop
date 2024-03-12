import { IconButton } from '@mui/material'
import IconifyIcon from 'src/components/Icon'
import { useSettings } from 'src/hooks/useSettings'
import { Mode } from 'src/types/layouts'

export const ModeToggle = () => {
  const { settings, saveSettings } = useSettings()
  const handleSaveSettings = (mode: Mode) => {
    saveSettings({...settings, mode})
  }
  const handleToggleButton = () => {
     if(settings.mode === 'dark'){
        handleSaveSettings('light')
     }else{
        handleSaveSettings('dark')
     }
  }
  return (
    <IconButton color='inherit' onClick={() => handleToggleButton()}>
      <IconifyIcon icon={settings.mode === 'light' ? 'material-symbols:dark-mode-outline' : 'iconamoon:mode-light'} />
    </IconButton>
  )
}
