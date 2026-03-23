import { Navigate, Route, Routes } from "react-router-dom"
import PatientConsultations from "../pages/patient/Consultations"
import PatientOrders from "../pages/patient/Orders"

function PatientRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="consultations" replace />} />
      <Route path="consultations" element={<PatientConsultations />} />
      <Route path="orders" element={<PatientOrders />} />
    </Routes>
  )
}

export default PatientRoutes