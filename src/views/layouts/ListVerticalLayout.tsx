import { Fragment, useEffect, useState } from 'react'

import { NextPage } from 'next'
import { Box, BoxProps, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import DraftsIcon from '@mui/icons-material/Drafts'
import SendIcon from '@mui/icons-material/Send'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'
import { Collapse } from '@mui/material'
import { VerticalItems } from 'src/configs/layout'
import IconifyIcon from 'src/components/Icon'
import { title } from 'process'

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
}

//xu li map danh sach menu
const RecursiveListItems: NextPage<TListItems> = ({ items, level, disable, openItems, setOpenItems }) => {
  const handleClick = (title: string) => {
    if (!disable) {
      setOpenItems(prev => ({
        ...prev,
        [title]: !prev[title]
      }))
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
              }}
              sx={{
                padding: `8px 10px 8px ${level * (level === 1 ? 28 : 20)}px`
              }}
            >
              <ListItemIcon>
                <IconifyIcon icon={item.icon} />
              </ListItemIcon>
              {/* <ListItemText primary={item.title} /> */}
              {!disable && <ListItemText primary={item?.title} />}
              {item?.childrens && item.childrens.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <IconifyIcon
                      style={{ transform: 'rotate(180deg)', transition: '0.5s' }}
                      icon={'ic:twotone-expand-less'}
                    />
                  ) : (
                    <IconifyIcon icon={'ic:twotone-expand-less'} style={{ transition: '0.5s' }} />
                  )}
                </>
              )}
            </ListItemButton>
            {item?.childrens && item.childrens.length > 0 && (
              <>
                {/* Ket qua map ra giua cha va childrens la giong nhau ==> neu check dk thay co children ==> goi lai RecursiveListItems vaf truyen children vao (ko p map them children 1 lan nua) */}
                <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                  <RecursiveListItems items={item.childrens} level={level + 1} openItems={openItems} setOpenItems={setOpenItems} disable={disable} />
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
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItems
        items={VerticalItems}
        level={1}
        disable={!open}
        openItems={openItems}
        setOpenItems={setOpenItems}
      />
    </List>
  )
}

export default ListVerticalLayout
