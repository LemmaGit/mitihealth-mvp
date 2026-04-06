import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { withSuspense } from "../helper/withSuspense";

const Consultations = withSuspense(lazy(() => import("../pages/practitioner/Consultations")));
const Profile = withSuspense(lazy(() => import("../pages/practitioner/Profile")));

function PractitionerRoutes() {
  return (
    <Routes>
      <Route index element={<Consultations />} />
      <Route path="profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default PractitionerRoutes
