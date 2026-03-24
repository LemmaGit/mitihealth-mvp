import { Navigate, Route, Routes } from "react-router-dom"
import PatientConsultations from "../pages/patient/Consultations"
import PatientOrders from "../pages/patient/Orders"
import { CartProvider } from "../contexts/CartContext";
import Dashboard from "../pages/patient/Dashboard";
import Index from "../pages/patient/Index";
import PractitionerProfile from "../pages/patient/PractitionerProfile";
import Booking from "../pages/patient/Booking";
import Marketplace from "../pages/patient/MarketPlace";
import ProductDetail from "../pages/patient/ProductDetail";
import Cart from "../pages/patient/Cart";
import Messages from "../pages/patient/Messages";
function PatientRoutes() {
  return (
    <CartProvider>
    <Routes>
      {/* <Route index element={<Navigate to="consultations" replace />} />
      <Route path="consultations" element={<PatientConsultations />} />
      <Route path="orders" element={<PatientOrders />} /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Index />} />
      <Route path="/practitioner/:id" element={<PractitionerProfile />} />
      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/messages" element={<Messages />} />
    </Routes>
    </CartProvider>
  )
}

export default PatientRoutes