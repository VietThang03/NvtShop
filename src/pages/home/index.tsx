import Head from 'next/head'
import { ReactNode } from 'react'
import { TProduct } from 'src/types/product'
import HomePage from 'src/views/pages/home'
import LayoutNoApp from 'src/views/layouts/LayoutNoApp'

interface TOptions {
  label: string
  value: string
}

interface TProps {
  products: TProduct[]
  totalCount: number
  productTypes: TOptions[]
  params: {
    limit: number
    page: number
    order: string
    productType: string
  }
}

export default function Home(props: TProps) {
  const { products, totalCount, params, productTypes } = props

  return (
    <>
      <Head>
        <title>NvtShop - Danh sách sản phẩm</title>
        <meta
          name='description'
          content='Bán hàng điện tử, điện thoại, máy tính bảng, khóa học nextjs 14 reactjs typescript pro 2024 by Lập trình thật dễ - Xây dựng website bán hàng'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='keywords' content='ReactJS, NextJS 14, Typescript, Lập trình thật dễ' />
      </Head>
      <HomePage />
    </>
  )
}

Home.getLayout = (page: ReactNode) => <LayoutNoApp>{page}</LayoutNoApp>
Home.guestGuard = false
Home.authGuard = false
Home.title = 'Danh sách sản phẩm của cửa hàng Lập trình thật dễ'
