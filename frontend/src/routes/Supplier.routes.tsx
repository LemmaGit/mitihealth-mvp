import { lazy } from "react";
import { Route, Routes } from "react-router-dom"

const SupplierInventory = lazy(() => import("../pages/supplier/Inventory"));
const AddProduct = lazy(() => import("../pages/supplier/AddProduct"));
const SupplierOrders = lazy(() => import("../pages/supplier/Orders"));
const SupplierOrderDetail = lazy(() => import("../pages/supplier/OrderDetail"));

function SupplierRoutes() {
  return (
    <Routes>
      <Route index element={<SupplierInventory />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="orders" element={<SupplierOrders />} />
      <Route path="orders/:id" element={<SupplierOrderDetail />} />
    </Routes>
  )
}

export default SupplierRoutes
