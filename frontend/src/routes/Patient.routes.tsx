import { lazy } from "react";
import { Route, Routes } from "react-router-dom"
import { CartProvider } from "../contexts/CartContext";
const PatientConsultations = lazy(() => import("../pages/patient/Consultations"));
const PatientOrders = lazy(() => import("../pages/patient/Orders"));
// const Dashboard = lazy(() => import("../pages/patient/Dashboard"));
const Index = lazy(() => import("../pages/patient/Index"));
const PractitionerProfile = lazy(() => import("../pages/patient/PractitionerProfile"));
const Booking = lazy(() => import("../pages/patient/Booking"));
const Marketplace = lazy(() => import("../pages/patient/MarketPlace"));
const ProductDetail = lazy(() => import("../pages/patient/ProductDetail"));
const Cart = lazy(() => import("../pages/patient/Cart"));
const Messages = lazy(() => import("../pages/Messages"));
function PatientRoutes() {
  return (
    <Routes>
      <Route index element={<Index />} />
      {/* <Route path="dashboard" element={<Dashboard />} /> */}
      <Route path="practitioners" element={<Index />} />
      <Route path="consultations" element={<PatientConsultations />} />
      <Route path="orders" element={<PatientOrders />} />
      <Route path="practitioner/:id" element={<PractitionerProfile />} />
      <Route path="booking/:id" element={<Booking />} />
      <Route path="marketplace" element={<CartProvider><Marketplace /></CartProvider>} />
      <Route path="marketplace/:id" element={<CartProvider><ProductDetail /></CartProvider>} />
      <Route path="cart" element={<CartProvider><Cart /></CartProvider>} />
      <Route path="messages" element={<Messages />} />
      {/* <Route path="*" element={<Navigate to="/patient" replace />} /> */}
    </Routes>
  )
}

export default PatientRoutes