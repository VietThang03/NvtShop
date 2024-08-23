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
      title: 'Products',
      icon: 'material-symbols:production-quantity-limits-rounded',
      childrens: [
        {
          title: 'Product List',
          icon: 'icon-park-outline:ad-product',
          path: ROUTE_CONFIG.PRODUCTS.MANAGER_PRODUCT,
          permission: PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW
        },
        {
          title: 'Product Portfolio',
          icon: 'material-symbols:dual-screen',
          path: ROUTE_CONFIG.PRODUCTS.MANAGER_TYPE_PRODUCT        
        },
        {
          title: 'Order List',
          icon: 'lets-icons:order-light',
          path: ROUTE_CONFIG.PRODUCTS.MANAGER_ORDER,
          permission: PERMISSIONS.MANAGE_ORDER.ORDER.VIEW
        },
        {
          title: 'Review List',
          icon: 'carbon:review',
          path: ROUTE_CONFIG.PRODUCTS.MANAGER_REVIEW
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
