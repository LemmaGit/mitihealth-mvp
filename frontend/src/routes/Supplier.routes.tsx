import { lazy } from "react";
import { Route, Routes } from "react-router-dom"
const SupplierDashboard = lazy(() => import("../pages/supplier/Dashboard"));
const SupplierInventory = lazy(() => import("../pages/supplier/Inventory"));
const AddProduct = lazy(() => import("../pages/supplier/AddProduct"));
const SupplierOrders = lazy(() => import("../pages/supplier/Orders"));

function SupplierRoutes() {
  return (
    <Routes>
      <Route index element={<SupplierDashboard />} />
      <Route path="inventory" element={<SupplierInventory />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="orders" element={<SupplierOrders />} />
    </Routes>
  )
}

export default SupplierRoutes