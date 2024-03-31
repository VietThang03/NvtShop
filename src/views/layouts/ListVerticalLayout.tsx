import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'

import { NextPage } from 'next'
import { ListItemButton, ListItemIcon, ListItemText, ListItemTextProps, Tooltip, styled, useTheme } from '@mui/material'
import List from '@mui/material/List'
import { Collapse } from '@mui/material'
import { VerticalItems } from 'src/configs/layout'
import IconifyIcon from 'src/components/Icon'
import { useRouter } from 'next/router'

type TProps = {
  open: boolean
}

type TListItems = {
  level: number
  openItems: {
    [key: string]: boolean
  }
  items: any
  setOpenItems: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean
    }>
  >
  disable: boolean
  activePath: string | null
  setActivePath: Dispatch<SetStateAction<string | null>>
}

interface TListItemText extends ListItemTextProps {
  active: boolean
}

const StyleListItemText = styled(ListItemText)<TListItemText>(({ theme, active }) => ({
  '.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary': {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    dispaly: 'block',
    width: '100%',
    color: active
      ? `${theme.palette.customColors.lightPaperBg} !important`
      : `rgba(${theme.palette.customColors.main}, 0.78)`,
    fontWeight: active ? 600 : 400
  }
}))

//xu li map danh sach menu
const RecursiveListItems: NextPage<TListItems> = ({
  items,
  level,
  disable,
  openItems,
  setOpenItems,
  activePath,
  setActivePath
}) => {
  const router = useRouter()
  const theme = useTheme()
  const handleClick = (title: string) => {
    if (!disable) {
      setOpenItems(prev => ({
        ...prev,
        [title]: !prev[title]
      }))
    }
  }

  const handleSelectItem = (path: string) => {
    setActivePath(path)
    if(path){
      router.push(path)
    }
  }

  return (
    <>
      {items?.map((item: any, index: number) => {
        return (
          <Fragment key={item.title}>
            <ListItemButton
              onClick={() => {
                if (item?.childrens) {
                  handleClick(item.title)
                }
                handleSelectItem(item?.path)
              }}
              sx={{
                padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`,
                backgroundColor:
                  (activePath && item.path === activePath) || !!openItems[item.title]
                    ? `${theme.palette.primary.main} !important`
                    : theme.palette.background.paper
              }}
            >
              <ListItemIcon>
                <IconifyIcon
                  style={{
                    color:
                      (activePath && item.path === activePath) || openItems[item.title]
                        ? theme.palette.customColors.lightPaperBg
                        : `rgba(${theme.palette.customColors.main}, 0.78)`
                  }}
                  icon={item.icon}
                />
              </ListItemIcon>
              {!disable && (
                //@ts-ignore
                <Tooltip title={item?.title}>
                  {' '}
                  <StyleListItemText
                    sx={{
                      color: '#fff !important'
                    }}
                    active={Boolean((activePath && item.path === activePath) || !!openItems[item.title])}
                    primary={item?.title}
                  />
                </Tooltip>
              )}
              {item?.childrens && item.childrens.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <IconifyIcon
                      style={{
                        transform: 'rotate(180deg)',
                        transition: '0.5s',
                        color:
                          (activePath && item.path === activePath) || openItems[item.title]
                            ? theme.palette.customColors.lightPaperBg
                            : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                      icon={'ic:twotone-expand-less'}
                    />
                  ) : (
                    <IconifyIcon
                      icon={'ic:twotone-expand-less'}
                      style={{
                        transition: '0.5s',
                        color:
                          (activePath && item.path === activePath) || openItems[item.title]
                            ? theme.palette.customColors.lightPaperBg
                            : `rgba(${theme.palette.customColors.main}, 0.78)`
                      }}
                    />
                  )}
                </>
              )}
            </ListItemButton>
            {item?.childrens && item.childrens.length > 0 && (
              <>
                {/* Ket qua map ra giua cha va childrens la giong nhau ==> neu check dk thay co children ==> goi lai RecursiveListItems vaf truyen children vao (ko p map them children 1 lan nua) */}
                <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                  <RecursiveListItems
                    items={item.childrens}
                    level={level + 1}
                    openItems={openItems}
                    setOpenItems={setOpenItems}
                    disable={disable}
                    activePath={activePath}
                    setActivePath={setActivePath}
                  />
                </Collapse>
              </>
            )}
          </Fragment>
        )
      })}
    </>
  )
}

// xu li hien ui danh sach menu
const ListVerticalLayout: NextPage<TProps> = ({ open }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [activePath, setActivePath] = useState<null | string>('')
  useEffect(() => {
    if (!open) {
      handleToggleAll()
    }
  }, [open])
  const handleToggleAll = () => {
    setOpenItems({})
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
    >
      <RecursiveListItems
        items={VerticalItems}
        level={1}
        disable={!open}
        openItems={openItems}
        setOpenItems={setOpenItems}
        activePath={activePath}
        setActivePath={setActivePath}
      />
    </List>
  )
}

export default ListVerticalLayout
