import { PERMISSIONS } from "src/configs/permission"
import ProductListPage from "src/views/pages/manage-product/product/ProductList"

const ProductPage = () => {
  return (
   <ProductListPage/>
  )
}

ProductPage.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW]
export default ProductPage
