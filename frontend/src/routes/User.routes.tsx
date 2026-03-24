import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import { useUser } from "@clerk/react"
import { PropagateLoader } from "react-spinners"
import Loader from "../components/Loader"
import { useAuthStore } from "../store/useAuthStore"
const MainLayout = lazy(() => import("../components/layouts/MainLayout"));
const SupplierRoutes = lazy(() => import("./Supplier.routes"));
const PatientRoutes = lazy(() => import("./Patient.routes"));
const PractitionerRoutes = lazy(() => import("./Practitioner.routes"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const AdminRoutes = lazy(() => import("./Admin.routes"));
const PatientLayout = lazy(() => import("../components/layouts/PatientLayout").then((m) => ({ default: m.PatientLayout })));

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
  const {authUser} = useAuthStore()
  const role = authUser?.unsafeMetadata?.role
  return (
    <Routes>
      <Route element={<ProtectedRoute>
        {role!=="patient" ?
        <MainLayout />:
        <PatientLayout/>
        }
        
        </ProtectedRoute>}>
        <Route path="admin/*" element={<AdminRoutes />} />
        <Route path="supplier/*" element={<SupplierRoutes />} />
        <Route path="patient/*" element={<PatientRoutes />} />
        <Route path="practitioner/*" element={<PractitionerRoutes />} />  
        <Route path="product/:id" element={<ProductDetail />} />
      </Route>
    </Routes>
  )
}

export default UserRoutes