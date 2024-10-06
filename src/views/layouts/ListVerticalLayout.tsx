import { Dispatch, Fragment, SetStateAction, useEffect, useMemo, useState } from 'react'

import { NextPage } from 'next'
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
  Tooltip,
  styled,
  useTheme
} from '@mui/material'
import List from '@mui/material/List'
import { Collapse } from '@mui/material'
import { TVertical, VerticalItems } from 'src/configs/layout'
import IconifyIcon from 'src/components/Icon'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { PERMISSIONS } from 'src/configs/permission'

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
    if (path) {
      router.push(path)
    }
  }

  const isParentHaveChildActive = (item: TVertical): boolean => {
    if (!item.childrens) {
      return item.path === activePath
    }

    return item.childrens.some((item: TVertical) => isParentHaveChildActive(item))
  }

  return (
    <>
      {items?.map((item: any, index: number) => {
        const isParentActive = isParentHaveChildActive(item)
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
                margin: '1px 0px',
                backgroundColor:
                  (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                    ? `${theme.palette.primary.main} !important`
                    : theme.palette.background.paper,
                     //display: !item?.childrens.length && !item.path ? "none" : "flex"
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    borderRadius: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    height: '30px',
                    width: '30px',
                    backgroundColor:
                      (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                        ? `${theme.palette.primary.main} !important`
                        : theme.palette.background.paper                      
                  }}
                >
                  <IconifyIcon
                    style={{
                      color:
                        (activePath && item.path === activePath) || openItems[item.title]
                          ? theme.palette.customColors.lightPaperBg
                          : `rgba(${theme.palette.customColors.main}, 0.78)`
                    }}
                    icon={item.icon}
                  />
                </Box>
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
  const router = useRouter()

  const { user } = useAuth()
  const permissionUser = user?.role?.permissions
    ? user?.role?.permissions?.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD]
      : user?.role?.permissions
    : []

  const listVerticalItems = VerticalItems()

  const findParentActivePath = (items: TVertical[], activePath: string) => {
    for (const item of items) {
      if (item.path === activePath) {
        return item.title
      }
      if (item.childrens && item.childrens.length > 0) {
        const child: any = findParentActivePath(item.childrens, activePath)
        if (child) {
          return item.title
        }
      }
    }

    return null
  }

  const hasPermission = (item: any, permissionUser: string[]) => {
    return permissionUser.includes(item.permission) || !item.permission
  }

  const formatMenuByPermission = (menu: any[], permissionUser: string[]) => {
    if (menu) {
      return menu.filter(item => {
        if (hasPermission(item, permissionUser)) {
          if (item.childrens && item.childrens.length > 0) {
            item.childrens = formatMenuByPermission(item.childrens, permissionUser)
          }

          if (!item?.childrens?.length && !item.path) {
            return false
          }

          return true
        }

        return false
      })
    }

    return []
  }

  useEffect(() => {
    if (!open) {
      handleToggleAll()
    }
  }, [open])

  const handleToggleAll = () => {
    setOpenItems({})
  }

  const memoFormatMenu = useMemo(() => {
    if (permissionUser.includes(PERMISSIONS.ADMIN)) {
      return listVerticalItems
    }

    return formatMenuByPermission(listVerticalItems, permissionUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listVerticalItems, permissionUser])

  useEffect(() => {
    if (router.asPath) {
      const parentTitle = findParentActivePath(memoFormatMenu, router.asPath)
      if (parentTitle) {
        setOpenItems({
          [parentTitle]: true
        })
      }
      setActivePath(router.asPath)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }} component='nav'>
      <RecursiveListItems
        items={memoFormatMenu}
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
