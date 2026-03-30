import { lazy } from "react";
import { Route, Routes } from "react-router-dom"
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const PractitionerVerification = lazy(() => import("../pages/admin/PractitionerVerification"));
const ProductVerification = lazy(() => import("../pages/admin/ProductVerification"));

function AdminRoutes() {
  return (
    <Routes>
      <Route path="users" element={<UserManagement />} />
      <Route index element={<UserManagement />} />
      <Route path="practitioner-verification" element={<PractitionerVerification />} />
      <Route path="product-verification" element={<ProductVerification />} />
    </Routes>   
  )
}

export default AdminRoutes
