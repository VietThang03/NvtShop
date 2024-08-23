import { InputBase, alpha, styled } from '@mui/material'
import IconifyIcon from '../Icon'
import { useEffect, useState } from 'react'
import { useDebounce } from 'src/hooks/useDebounce'

interface TProps {
  value: string
  onChange: (value: string) => void
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: '0 !important',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  },
  border: `1px solid ${theme.palette.customColors.borderColor}`,
  height: '38px'
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width')
  }
}))

const InputSearch = ({value, onChange}: TProps) => {
  const [search, setSearch] = useState<string>(value)
  const debounceSearch = useDebounce(search, 300);
  useEffect(() => {
    onChange(debounceSearch)
  }, [debounceSearch])

  return (
    <Search>
      <SearchIconWrapper>
        <IconifyIcon icon="material-symbols-light:search"/>
      </SearchIconWrapper>
      <StyledInputBase placeholder='Search…' value={search} onChange={e => setSearch(e.target.value)} inputProps={{ 'aria-label': 'search' }} />
    </Search>
  )
}

export default InputSearch
