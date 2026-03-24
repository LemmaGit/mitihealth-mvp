import { Route, Routes } from "react-router-dom"
import UserManagement from "../pages/admin/UserManagement"
import PractitionerVerification from "../pages/admin/PractitionerVerification"
import ProductVerification from "../pages/admin/ProductVerification"

function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<UserManagement />} />
      <Route path="practitioner-verification" element={<PractitionerVerification />} />
      <Route path="product-verification" element={<ProductVerification />} />
    </Routes>   
  )
}

export default AdminRoutes