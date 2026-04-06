import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { CartProvider } from "../contexts/CartContext";
import { withSuspense } from "../helper/withSuspense";

const PatientConsultations = withSuspense(lazy(() => import("../pages/patient/Consultations")));
const PatientOrders = withSuspense(lazy(() => import("../pages/patient/Orders")));
const Index = withSuspense(lazy(() => import("../pages/patient/Index")));
const PractitionerProfile = withSuspense(lazy(() => import("../pages/patient/PractitionerProfile")));
const Booking = withSuspense(lazy(() => import("../pages/patient/Booking")));
const Marketplace = withSuspense(lazy(() => import("../pages/patient/MarketPlace")));
const ProductDetail = withSuspense(lazy(() => import("../pages/patient/ProductDetail")));
const Cart = withSuspense(lazy(() => import("../pages/patient/Cart")));
const Messages = withSuspense(lazy(() => import("../pages/Messages")));

function PatientRoutes() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="practitioners" element={<Index />} />
      <Route path="consultations" element={<PatientConsultations />} />
      <Route path="orders" element={<PatientOrders />} />
      <Route path="practitioner/:id" element={<PractitionerProfile />} />
      <Route path="booking/:id" element={<Booking />} />
      <Route path="marketplace" element={<CartProvider><Marketplace /></CartProvider>} />
      <Route path="marketplace/:id" element={<CartProvider><ProductDetail /></CartProvider>} />
      <Route path="cart" element={<CartProvider><Cart /></CartProvider>} />
      <Route path="messages" element={<Messages />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default PatientRoutes
