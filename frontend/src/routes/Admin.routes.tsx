import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { withSuspense } from "../helper/withSuspense";

const UserManagement = withSuspense(lazy(() => import("../pages/admin/UserManagement")));
const PractitionerVerification = withSuspense(lazy(() => import("../pages/admin/PractitionerVerification")));
const ProductVerification = withSuspense(lazy(() => import("../pages/admin/ProductVerification")));

function AdminRoutes() {
  return (
    <Routes>
      <Route path="users" element={<UserManagement />} />
      <Route index element={<UserManagement />} />
      <Route path="practitioner-verification" element={<PractitionerVerification />} />
      <Route path="product-verification" element={<ProductVerification />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>   
  )
}

export default AdminRoutes
