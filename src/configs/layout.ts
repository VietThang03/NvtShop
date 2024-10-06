import { useTranslation } from 'react-i18next'
import { PERMISSIONS } from './permission'
import { ROUTE_CONFIG } from './route'

export type TVertical = {
  title: string
  path?: string
  icon: string
  permission?: string
  childrens?: {
    title: string
    path?: string
    icon: string
    permission?: string
  }[]
}

export const VerticalItems = () => {
  const { t } = useTranslation()
  return [
    {
      title: 'Dashboard',
      icon: 'material-symbols-light:dashboard-outline',
      path: ROUTE_CONFIG.DASHBOARD,
      permission: PERMISSIONS.DASHBOARD
    },
    {
      title: 'Systems',
      icon: 'eos-icons:file-system-outlined',
      childrens: [
        {
          title: 'User',
          icon: 'iconoir:group',
          path: ROUTE_CONFIG.SYSTEM.USER,
          permission: PERMISSIONS.SYSTEM.USER.VIEW
        },
        {
          title: 'Permissions',
          icon: 'icon-park-outline:permissions',
          path: ROUTE_CONFIG.SYSTEM.ROLE,
          permission: PERMISSIONS.SYSTEM.ROLE.VIEW
        }
      ]
    },
    {
      title: 'Manage Product',
      icon: 'eos-icons:products-outlined',
      childrens: [
        {
          title:' List Product',
          icon: 'icon-park-outline:ad-product',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.PRODUCT,
          permission: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW
        },
        {
          title: 'Type product',
          icon: 'material-symbols-light:category-outline',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
        },
        {
          title: 'Comment',
          icon: 'material-symbols-light:comment-outline',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.COMMENT
        }
      ]
    },
    {
      title: t('Manage_order'),
      icon: 'carbon:order-details',
      childrens: [
        {
          title: t('List_order'),
          icon: 'lets-icons:order-light',
          path: ROUTE_CONFIG.MANAGE_ORDER.ORDER,
          permission: PERMISSIONS.MANAGE_ORDER.ORDER.VIEW
        },
        {
          title: t('List_review'),
          icon: 'carbon:review',
          path: ROUTE_CONFIG.MANAGE_ORDER.MANAGE_REVIEW
        }
      ]
    },
    {
      title: 'Settings',
      icon: 'material-symbols:settings-outline',
      childrens: [
        {
          title: 'Setting City',
          icon: 'material-symbols:location-city-rounded',
          path: ROUTE_CONFIG.SETTINGS.CITY
        },
        {
          title: 'Setting Delivery',
          icon: 'iconamoon:delivery-free-fill',
          path: ROUTE_CONFIG.SETTINGS.DELIVERY_TYPE
        },
        {
          title: 'Setting Payment',
          icon: 'material-symbols:payments',
          path: ROUTE_CONFIG.SETTINGS.PAYMENT_TYPE
        }
      ]
    }
  ]
}
