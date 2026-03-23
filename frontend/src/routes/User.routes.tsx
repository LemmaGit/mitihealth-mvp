import { Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "../components/layouts/MainLayout"
import SupplierRoutes from "./Supplier.routes"
import PatientRoutes from "./Patient.routes"
import PractitionerRoutes from "./Practitioner.routes"
import ProductDetail from "../pages/ProductDetail"
import { useUser } from "@clerk/react"
import { PropagateLoader } from "react-spinners"
import Loader from "../components/Loader"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded) {
    return <Loader isFullPage={true}>
        <PropagateLoader color="#004c22" />
    </Loader>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = user?.unsafeMetadata?.role;
  if (!hasRole) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

function UserRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="supplier/*" element={<SupplierRoutes />} />
        <Route path="patient/*" element={<PatientRoutes />} />
        <Route path="practitioner/*" element={<PractitionerRoutes />} />  
        <Route path="product/:id" element={<ProductDetail />} />
      </Route>
    </Routes>
  )
}

export default UserRoutes