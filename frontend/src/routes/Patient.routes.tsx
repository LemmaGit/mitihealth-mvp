import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { CartProvider } from "../contexts/CartContext";
const PatientConsultations = lazy(() => import("../pages/patient/Consultations"));
const PatientOrders = lazy(() => import("../pages/patient/Orders"));
const Dashboard = lazy(() => import("../pages/patient/Dashboard"));
const Index = lazy(() => import("../pages/patient/Index"));
const PractitionerProfile = lazy(() => import("../pages/patient/PractitionerProfile"));
const Booking = lazy(() => import("../pages/patient/Booking"));
const Marketplace = lazy(() => import("../pages/patient/MarketPlace"));
const ProductDetail = lazy(() => import("../pages/patient/ProductDetail"));
const Cart = lazy(() => import("../pages/patient/Cart"));
const Messages = lazy(() => import("../pages/patient/Messages"));
function PatientRoutes() {
  return (
    <CartProvider>
    <Routes>
      <Route index element={<Index />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="consultations" element={<PatientConsultations />} />
      <Route path="orders" element={<PatientOrders />} />
      <Route path="practitioner/:id" element={<PractitionerProfile />} />
      <Route path="booking/:id" element={<Booking />} />
      <Route path="marketplace" element={<Marketplace />} />
      <Route path="marketplace/:id" element={<ProductDetail />} />
      <Route path="cart" element={<Cart />} />
      <Route path="messages" element={<Messages />} />
      <Route path="*" element={<Navigate to="/patient" replace />} />
    </Routes>
    </CartProvider>
  )
}

export default PatientRoutes