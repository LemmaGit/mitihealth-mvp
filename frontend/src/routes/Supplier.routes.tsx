import { Route, Routes } from "react-router-dom"
import SupplierDashboard from "../pages/supplier/Dashboard"
import SupplierInventory from "../pages/supplier/Inventory"
import AddProduct from "../pages/supplier/AddProduct"

function SupplierRoutes() {
  return (
    <Routes>
      <Route index element={<SupplierDashboard />} />
      <Route path="inventory" element={<SupplierInventory />} />
      <Route path="add-product" element={<AddProduct />} />
    </Routes>
  )
}

export default SupplierRoutes