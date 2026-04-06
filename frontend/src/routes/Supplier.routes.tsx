import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { withSuspense } from "../helper/withSuspense";

const SupplierInventory = withSuspense(lazy(() => import("../pages/supplier/Inventory")));
const AddProduct = withSuspense(lazy(() => import("../pages/supplier/AddProduct")));
const SupplierOrders = withSuspense(lazy(() => import("../pages/supplier/Orders")));
const SupplierOrderDetail = withSuspense(lazy(() => import("../pages/supplier/OrderDetail")));

function SupplierRoutes() {
  return (
    <Routes>
      <Route index element={<SupplierInventory />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="orders" element={<SupplierOrders />} />
      <Route path="orders/:id" element={<SupplierOrderDetail />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default SupplierRoutes
