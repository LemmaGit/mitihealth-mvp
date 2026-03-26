import { lazy } from "react";
import { Route, Routes } from "react-router-dom"
const Consultations = lazy(() => import("../pages/practitioner/Consultations"));
const Profile = lazy(() => import("../pages/practitioner/Profile"));

function PractitionerRoutes() {
  return (
    <Routes>
      <Route index element={<Consultations />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  )
}

export default PractitionerRoutes